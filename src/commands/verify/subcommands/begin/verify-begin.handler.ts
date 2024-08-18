import { tokenUser } from "../../../../database-config";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { generateToken } from "../../../../shared/utils/generate-token";
import { sendMail } from "../../../../shared/utils/mail";
import { isKthEmail, verifyUser } from "../util";
import { VerifyBeginVariables } from "./verify-begin.variables";
import * as db from "../../../../db/db";
import { getHodisUser, isDangerOfNollan } from "../../../../shared/utils/hodis";
import { VerifyingUser } from "../../../../shared/types/VerifyingUser";

export const handleVerifyBegin = async (
	interaction: GuildChatInputCommandInteraction,
	darkmode: boolean
): Promise<void> => {
	const { user, options } = interaction;
	await interaction.deferReply({ ephemeral: true });
	const email = options.getString(VerifyBeginVariables.EMAIL, true);
	if (
		!isKthEmail(email) &&
		(await getHodisUser(email.split("@")[0])) !== null
	) {
		await interaction.editReply({
			content: "Please enter a valid KTH email address.",
		});
		return;
	}

	// Bypass for international students
	const code = options.getString(VerifyBeginVariables.CODE, false);
	const isIntis = code === process.env.CODE_INTIS;

	const kthId = email.split("@")[0];

	if ((await isDangerOfNollan(kthId, darkmode)) && !isIntis) {
		await interaction.editReply({
			content: "...!̵̾͌.̸͆̅.̷̊̈́.̵͛̋Ë̵̔R̴̓͝R̵̐OR come bẵ̴c̴̋̔k̷̽ 16 se͆͠p̸̀̐t̵̐͑e̶̓̌m̵ber...ERR̶̈́͋Ô̶͂R̷̾͝.̷̊́.̶̓͒.̵͊̑.̸̑ERROR...",
		});
		return;
	}

	const dbDiscordId = await db.getDiscordIdByKthid(kthId);

	if (dbDiscordId !== null) {
		// KTH ID is stored in the DB
		if (dbDiscordId === user.id) {
			// Same Discord account is verifying
			await interaction.editReply({
				content:
					"It seems you're already verified on another Konglig server. Welcome!",
			});
			try {
				verifyUser(interaction.user, interaction.guild, kthId);
			} catch (error) {
				console.warn(error);
				await interaction.reply({
					content: "Something went wrong, please try again.",
					ephemeral: true,
				});
			}
			return;
		} else {
			// Another Discord account is verifying
			await interaction.editReply({
				content:
					"Verification unsuccessful, your KTH account has already been used to verify another Discord account.",
			});
			console.log(
				`Failed to verify user due to KTH ID already being used for another Discord account. email="${email}" user.id="${user.id}" user.username="${user.username}"`
			);
			return;
		}
	}

	const token = generateToken(parseInt(process.env.TOKEN_SIZE as string));
	const timeout = parseInt(process.env.TOKEN_TIMEOUT as string);
	const verifyingUser = new VerifyingUser(email, user.id, isIntis);
	await tokenUser.set(token, verifyingUser, timeout);

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
