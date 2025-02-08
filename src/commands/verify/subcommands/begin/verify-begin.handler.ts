import { tokenUser } from "../../../../database-config";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { generateToken } from "../../../../shared/utils/generate-token";
import { sendMail } from "../../../../shared/utils/mail";
import { isKthEmail, verifyUser } from "../util";
import { VerifyBeginVariables } from "./verify-begin.variables";
import * as db from "../../../../db/db";
import { getHodisUser, isDangerOfNollan } from "../../../../shared/utils/hodis";
import { VerifyingUser } from "../../../../shared/types/VerifyingUser";
import { MessageFlags } from "discord.js";
import { GuildModalSubmitInteraction } from "../../../../shared/types/GuildModalSubmitInteraction";

// The basic logic of handleVerifyBegin() implemented in an
// "interaction-agnostic manner".
export async function handleVerifyBeginBase(
	email: string,
	interaction: GuildChatInputCommandInteraction | GuildModalSubmitInteraction,
	darkmode: boolean,
	code?: string
): Promise<void> {
	const user = interaction.user;

	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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
				// Should always be true, so long as the command is only used in a guild.
				if (interaction.guild !== null) {
					verifyUser(user, interaction.guild, kthId);
				}
			} catch (error) {
				console.warn(error);
				await interaction.reply({
					content: "Something went wrong, please try again.",
					flags: MessageFlags.Ephemeral
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
			content: `Check the inbox of ${email} for your verification code: <https://webmail.kth.se/>\nSubmit your verification code by clicking the submit button above.\nNote that by submitting the verification code, you accept that Konglig Datasektionen may store your Discord ID and name together with your email address. This will be stored in accordance with the chapter's [information processing policy](<https://styrdokument.datasektionen.se/pm_informationshantering>).`,
		});
	} catch (error) {
		console.error(error);
		await interaction.editReply({
			content: "Something went wrong, please try again.",
		});
	}
}

export async function handleVerifyBegin(
	interaction: GuildChatInputCommandInteraction | GuildModalSubmitInteraction,
	darkmode: boolean
): Promise<void> {
	if (interaction.isModalSubmit()) {
		const email = interaction.fields.getTextInputValue("beginVerifyEmail");

		if (darkmode) {
			const code =
				interaction.fields.getTextInputValue("beginVerifyCode");

			await handleVerifyBeginBase(email, interaction, darkmode, code);
		} else {
			await handleVerifyBeginBase(email, interaction, darkmode);
		}
	} else if (interaction.isChatInputCommand()) {
		const { options } = interaction;
		const email = options.getString(VerifyBeginVariables.EMAIL, true);
		const code = options.getString(VerifyBeginVariables.CODE, false);

		if (code === null) {
			await handleVerifyBeginBase(
				email,
				interaction,
				darkmode,
				undefined
			);
		} else {
			await handleVerifyBeginBase(email, interaction, darkmode, code);
		}
	} else {
		console.warn("Unexpected call to handleVerifyBegin(). Origin was neither a slash command, nor a modal submission.");
	}
}
