import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { addRolesOrRollback } from "../../../../shared/utils/atomic-roles";
import {
	setRole,
	setN0llanRole,
	hasRoleN0llan,
} from "../../../../shared/utils/roles";
import { verifyNolleCode } from "../../../../shared/utils/verify_nolle_code";
import { VerifyNollanVariables } from "./verify-nollan.variables";

export const handleVerifyNollan = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { user, guild, options } = interaction;
	await interaction.deferReply({ ephemeral: true });
	const code = options.getString(VerifyNollanVariables.NOLLE_KOD, true);

	// Check if n0llan already verified
	if (await hasRoleN0llan(user, guild)) {
		await interaction.editReply({
			content: "Du är redan verifierad och schleeemig!\nOm du tror att det skett ett misstag, vänligen kontakta din Dadda.",
		});
		return;
	}

	try {
		// Check if nolle-code is valid
		const validNollegruppRoleName = verifyNolleCode(code);
		if (!validNollegruppRoleName) {
			await interaction.editReply({
				content: "Error: Invalid code!\nVänligen skriv in den personliga kod du fått från din Dadda.\nOm du har problem, kontakta din Dadda!",
			});
			return;
		}

		await addRolesOrRollback(user, interaction.guild, async (user, guild) => {
			await setN0llanRole(user, guild);
			await setRole(user, validNollegruppRoleName, guild); // Add n0llegrupp role
		});

		await interaction.editReply({
			content: "Välkommen nøllan! Du har nu blivit tillagd i några kanaler, inklusive kanaler för de första kurserna. Ha kul med schlemandet!"
		});
	} catch (error) {
		console.warn(error);
		await interaction.editReply({
			content: "Något gick fel, var vänlig försök igen.",
		});
		return;
	}
};
