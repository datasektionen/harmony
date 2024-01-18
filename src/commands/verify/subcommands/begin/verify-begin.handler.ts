import { tokenDiscord, tokenEmail } from "../../../../database-config";
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
	const email = options.getString(VerifyBeginVariables.EMAIL, true);
	if (!isKthEmail(email)) {
		await interaction.editReply({
			content: "Please enter a valid KTH email address.",
		});
		return;
	}
	const token = generateToken(parseInt(process.env.TOKEN_SIZE as string));
	const timeout = parseInt(process.env.TOKEN_TIMEOUT as string);
	await tokenDiscord.set(token, user.id, timeout);
	await tokenEmail.set(token, email, timeout);

	try {
		await sendMail(email, token);
		await interaction.editReply({
			content: `Check the inbox of ${email} for your verification code: <https://webmail.kth.se/>\nSubmit your verification code using the \`/verify submit\` command.\nNote that by submitting the verification code, you accept that Konglig Datasektionen may store your discord ID and name together with your email address. This will be stored in accordance with the chapter's [information processing policy](<https://styrdokument.datasektionen.se/pm_informationshantering>).`,
		});
	} catch (error) {
		console.error(error);
		await interaction.editReply({
			content: "Something went wrong, please try again.",
		});
	}
};
