import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import { tokenDiscord, tokenEmail } from "../../../database-config";
import { generateToken } from "../../../utils/generate-token";
import { sendMail } from "../../../utils/mail";
import { isKthEmail } from "./util";

export const handleVerifyBegin = async (
	interaction: ChatInputCommandInteraction
) => {
	const { user, options } = interaction;
	const messageText = options.getString("email", true);
	if (!isKthEmail(messageText)) {
		await interaction.reply({
			content: "Please, enter a valid KTH email address.",
			ephemeral: true,
		});
		return;
	}

	const token = generateToken(parseInt(process.env.TOKEN_SIZE as string));
	const timeout = parseInt(process.env.TOKEN_TIMEOUT as string);
	await tokenDiscord.set(token, user.id, timeout);
	await tokenEmail.set(token, messageText, timeout);

	try {
		const result = await sendMail(messageText, token);
		console.log(`Email sent, received response: ${JSON.stringify(result)}`);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
	}
	await interaction.reply({
		content: `Verification email sent, check ${messageText} for your verification code.`,
		ephemeral: true,
	});
};
