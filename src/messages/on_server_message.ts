import { Message } from "discord.js";
import { kickUnverifiedUsers } from "../commands/kick_unverified_users";

export function onWelcome(message: Message, messageText: string) {
	if (messageText === "!verify") {
		return respondToAuthor(
			message,
			"Svara med din KTH-mejladress för att få en registreringskod! (ex: hello@kth.se)"
		);
	} else if (messageText === "!kick_unverified") {
		return kickUnverifiedUsers(message);
	}
	return sendMessage(
		message,
		" Använd kommandot '!verify' för att påbörja verifikationsprocessen och få tillgång till övriga kanaler!"
	);
}

function respondToAuthor(message: Message, successText: string) {
	message.author
		.createDM()
		.then((channel) => channel.send(successText))
		.catch((err) => console.error(err));
}

function sendMessage(message: Message, text: string) {
	message.channel
		.send(process.env.MESSAGE_PREFIX + text)
		.catch((err) => console.error(err));
}
