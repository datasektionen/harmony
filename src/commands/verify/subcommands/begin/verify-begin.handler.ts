import { tokenDiscord, tokenEmail } from "../../../../database-config";
import env from "../../../../shared/env";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { generateToken } from "../../../../shared/utils/generate-token";
import { sendMail } from "../../../../shared/utils/mail";
import { isKthEmail } from "../util";
import { VerifyBeginVariables } from "./verify-begin.variables";

export const handleVerifyBegin = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { user, options } = interaction;
	await interaction.deferReply({ ephemeral: true });
	const messageText = options.getString(VerifyBeginVariables.EMAIL, true);
	if (!isKthEmail(messageText)) {
		await interaction.editReply({
			content: "Please enter a valid KTH email address.",
		});
		return;
	}
	const token = generateToken(env.TOKEN_SIZE);
	await tokenDiscord.set(token, user.id, env.TOKEN_TIMEOUT);
	await tokenEmail.set(token, messageText, env.TOKEN_TIMEOUT);

	try {
		const result = await sendMail(messageText, token);
		console.log(`Email sent, received response: ${result}`);
		await interaction.editReply({
			content: `Check the inbox of ${messageText} for your verification code: <https://webmail.kth.se/>\nSubmit your verification code using the \`/verify submit\` command.`,
		});
	} catch (error) {
		console.error(error);
		await interaction.editReply({
			content: "Something went wrong, please try again.",
		});
	}
};
