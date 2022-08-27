import { setN0llanRole, setRoleVerified } from "../shared/utils/roles";
import { tokenDiscord, tokenEmail, verifiedUsers } from "../database-config";
import { sendMail } from "../shared/utils/mail";
import { Message } from "discord.js";
import { generateToken } from "../shared/utils/generate-token";
import {
	isKthEmail,
	messageIsToken,
} from "../commands/verify/subcommands/util";

export async function onDM(message: Message, messageText: string) {
	if (isKthEmail(messageText)) {
		const token = generateToken(parseInt(process.env.TOKEN_SIZE as string));
		const timeout = parseInt(process.env.TOKEN_TIMEOUT as string);
		await tokenDiscord.set(token, message.author.id, timeout);
		await tokenEmail.set(token, messageText, timeout);

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
		const [discordId, emailAddress] = await Promise.all([
			tokenDiscord.get(messageText) as Promise<string>,
			tokenEmail.get(messageText) as Promise<string>,
		]);

		if (emailAddress && discordId && discordId !== message.author.id) {
			verifiedUsers.set(discordId, emailAddress);
			try {
				await setRoleVerified(message.author);
				message.channel.send(
					`Du är nu verifierad. Dubbelkolla att du har blivit tilldelad @**${process.env.DISCORD_VERIFIED_ROLE}** rollen!`
				);
				await setN0llanRole(
					message.author,
					(emailAddress as string).split("@")[0]
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
