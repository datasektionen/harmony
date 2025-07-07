import { GuildModalSubmitInteraction } from "../../../../shared/types/GuildModalSubmitInteraction";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { addRolesOrRollback } from "../../../../shared/utils/atomic-roles";
import {
	setRole,
	setN0llanRole,
	hasRoleN0llan,
} from "../../../../shared/utils/roles";
import { VerifyNollanVariables } from "./verify-nollan.variables";
import { MessageFlags } from "discord.js";
import * as db from "../../../../db/db";
import { isKthEmail } from "../util";

export async function handleVerifyNollanBase(
	email: string,
	interaction: GuildChatInputCommandInteraction | GuildModalSubmitInteraction,
	nolleKod: string
): Promise<void> {
	const guild = interaction.guild;

	const { user } = interaction;
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	// Check if nØllan already verified
	if (await hasRoleN0llan(user, guild)) {
		await interaction.editReply({
			content:
				"Du är redan verifierad och schleeemig!\nOm du tror att det skett ett misstag, vänligen kontakta din Dadda.",
		});
		return;
	}

	// Hopefully nØllan knows how to activate their mail address.
	if (!isKthEmail(email)) {
		await interaction.editReply({
			content:
				"Var vänlig och skriv in en *riktig* KTH-mejladress, nØllan.",
		});
		return;
	}

	try {
		// Check if nolleKod is valid.
		const nollegruppRoleName = await db.getNollegruppNameByCode(nolleKod);
		if (nollegruppRoleName == null) {
			await interaction.editReply({
				content:
					"Error: Invalid code!\nVänligen skriv in den personliga kod du fått från din Dadda.\nOm du har problem, kontakta din Dadda!",
			});
			return;
		}

		await addRolesOrRollback(user, guild, async (user, guild) => {
			await setN0llanRole(user, guild);
			await setRole(user, nollegruppRoleName, guild); // Add n0llegrupp role
		});

		await interaction.editReply({
			content:
				"Välkommen nØllan! Du har nu blivit tillagd i några kanaler, inklusive kanaler för de första kurserna. Ha kul med schlemandet!",
		});

		// Add nØllan to database.
		const kthId = email.split("@")[0];
		db.insertNollan(kthId, user.id);
	} catch (error) {
		console.warn(error);
		await interaction.editReply({
			content: "Något gick fel, var vänlig försök igen.",
		});
		return;
	}
}

export async function handleVerifyNollan(
	interaction: GuildChatInputCommandInteraction | GuildModalSubmitInteraction
): Promise<void> {
	if (interaction.isModalSubmit()) {
		const nolleKod = interaction.fields.getTextInputValue(
			"verifyNollanNollekod"
		);
		const email = interaction.fields.getTextInputValue("verifyNollanEmail");

		await handleVerifyNollanBase(email, interaction, nolleKod);
	} else if (interaction.isChatInputCommand()) {
		const { options } = interaction;
		const nolleKod = options.getString(
			VerifyNollanVariables.NOLLE_KOD,
			true
		);
		const email = options.getString(VerifyNollanVariables.EMAIL, true);

		await handleVerifyNollanBase(email, interaction, nolleKod);
	} else {
		console.warn(
			"Unexpected call to handleVerifyNollan(). Origin was neither a slash command, nor a modal submission."
		);
	}
}
