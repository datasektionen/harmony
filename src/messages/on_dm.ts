import { setRoleVerified } from "../utils/roles";
import { token_discord, token_email, verified_users } from "../database_config";
import { sendMail } from "../utils/mail";
import { Message } from "discord.js";
import { generateToken } from "../utils/generate_token";

export async function onDM(message: Message, messageText: string) {
	if (isKthEmail(messageText)) {
		const token = generateToken(parseInt(process.env.TOKEN_SIZE as string));
		const timeout = parseInt(process.env.TOKEN_TIMEOUT as string);
		await token_discord.set(token, message.author.id, timeout);
		await token_email.set(token, messageText, timeout);

		let result;
		try {
			result = await sendMail(messageText, token);
		} catch (error) {
			console.error(error);
		}
		console.log(`Email sent, received response: ${JSON.stringify(result)}`);
		return message.channel
			.send("Verifikationskod skickad. Kolla din KTH-email!")
			.catch((err) => console.error(err));
	}

	if (messageIsToken(messageText)) {
		const [discord_id, email_address] = await Promise.all([
			token_discord.get(messageText),
			token_email.get(messageText),
		]);

		if (emailAndDiscordIdIsCorrect(message, email_address, discord_id)) {
			verified_users.set(discord_id, email_address);
			try {
				await setRoleVerified(message.author);
				message.channel.send(
					`Du är nu verifierad. Dubbelkolla att du har blivit tilldelad @**${process.env.DISCORD_VERIFIED_ROLE}** rollen!`
				);
			} catch (error) {
				console.error(error);
			}
			return;
		}

		return message.channel
			.send("Ogiltig verifieringskod! Försök igen.")
			.catch((err) => console.error(err));
	}

	// If the message is not and email address or a token then it's a faulty input.
	message.channel
		.send(
			"Oj, något har blivit fel! Du ska antingen svara med en @kth.se emailadress, eller en giltig verifikationskod."
		)
		.catch((err) => console.error(err));
}

function isKthEmail(messageText: string) {
	return new RegExp(/^[a-zA-Z0-9]+@kth[.]se$/).test(messageText);
}

function messageIsToken(messageText: string) {
	return messageText.match(/^[a-zA-Z0-9_-]+$/);
}

function emailAndDiscordIdIsCorrect(
	message: Message,
	email_address: string,
	discord_id: string
) {
	return (
		email_address &&
		discord_id &&
		discord_id.toString() === message.author.id.toString()
	);
}
