import { ChatInputCommandInteraction } from "discord.js";
import { tokenDiscord, tokenEmail } from "../../../../database-config";
import { generateToken } from "../../../../shared/utils/generate-token";
import { sendMail } from "../../../../shared/utils/mail";
import { isKthEmail } from "../util";
import { VerifyBeginVariables } from "./verify-begin.variables";

export const handleVerifyBegin = async (
	interaction: ChatInputCommandInteraction
) => {
	const { user, options } = interaction;
	const messageText = options.getString(VerifyBeginVariables.EMAIL, true);
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
		await interaction.reply({
			content: `Verification email sent, check ${messageText} for your verification code.`,
			ephemeral: true,
		});
		return;
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
		return;
	}
};
