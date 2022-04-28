import { Message } from "discord.js";
import { hasRoleVerified } from "../utils";
import { onDM } from "./on_dm";
import { onWelcome } from "./on_server_message";

/**
 * Listens to  message events emitted to the Client, and responds according to
 * context.
 *
 * Generally, there are 4 cases that we handle here:
 * - A user sends a message in the specified Welcome Channel
 * - A user sends the !verify command in the specified Welcome Channel
 * - A user sends Harmony a DM with a KTH address
 * - A user sends Harmony a DM with a Token-like string
 * Any other case is disregarded.
 *
 * The process is the following for any new, unverified user:
 * 1. They join the Welcome Channel when they join the Server ('Guild' as per Discord terms).
 * 2. They get a prompt from Harmony to use the !verify command.
 * 3. Upon using !verify, they are sent a DM by Harmony, requesting their KTH-address.
 * 4. The user sends their address to Harmony in the DM channel.
 * 5. Harmony generates a verification token, and sends an email containing the token via Spam,
 * 	  while also saving the token->email and token->discord_id association in their respective
 * 	  key-value stores.
 * 6. The user responds with the token in the DM channel.
 * 7. Harmony checks that the token is valid for that user.
 * 7.a If it is, the user is assigned the Verified role.
 * 7.b If it is not, Harmony responds with an error message.
 *
 * TODO: Should probably break this up into smaller functions, and I am not
 * 		100% certain on how correct the async behavior is...
 */
export async function onMessage(message: Message) {
	if (message.author.bot || (await hasRoleVerified(message.author))) {
		return;
	}

	const messageText = message.content.trim();
	if (inWelcomeChat(message)) onWelcome(message, messageText);
	else if (inDM(message)) onDM(message, messageText);
}

function inWelcomeChat(msg: Message) {
	return msg.channel.id === process.env.DISCORD_WELCOME_CHANNEL_ID;
}

function inDM(msg: Message) {
	return msg.channel.type === "dm";
}
