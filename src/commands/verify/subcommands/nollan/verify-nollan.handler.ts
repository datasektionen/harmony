import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { addRolesOrRollback } from "../../../../shared/utils/atomic-roles";
import { handleChannel } from "../../../../shared/utils/channel-utils";
import {
	setPingRoles,
	setYearRoles,
	setNollegruppRoles,
	setN0llanRole,
	hasRoleN0llan,
} from "../../../../shared/utils/roles";
import { verifyNolleCode } from "../../../../shared/utils/verify_nolle_code";
import { joinChannel } from "../../../join/join.handler";
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

	// Check if code is valid
	const validNollegruppRoleNames = verifyNolleCode(code);
	if (!validNollegruppRoleNames) {
		await interaction.editReply({
			content: "Ogiltig kod! Vänligen skriv in den personliga kod du fått från din Dadda.\nOm du har problem kontakta din Dadda!",
		});
		return;
	}

	try {
		await addRolesOrRollback(user, interaction.guild, async (user, guild) => {
			//await setRoleVerified(user, guild);
			await setN0llanRole(user, guild);

			const year = new Date().getFullYear();
			const yearRole = "D-" + year.toString()[2] + year.toString()[3];

			await setYearRoles(user, yearRole, guild);

			// Add all ping roles
			await setPingRoles(user, guild);

			// Add n0llegrupps roles
			await setNollegruppRoles(user, validNollegruppRoleNames, guild);
		});
		
		// Join all pre-NG courses
		// sf0003n, sf1671n, dd1337n, da1600n, dd1390n
		// n-suffix is nolle-version
		const courseCodes = ["sf0003n", "sf1671n", "dd1337n", "da1600n", "dd1390n"];

		await Promise.all(
			courseCodes.map(async (code) => {
				try {
					await handleChannel(code, interaction, joinChannel, true);
				} catch {
					console.log("Couldn't join channel: " + code);
				}
			})
		);



		await interaction.editReply({ content: "Välkommen nøllan! Du har nu blivit tillagd i några kanaler, inklusive kanaler för de första kurserna. Ha kul med schlemandet!" });
	} catch (error) {
		console.warn(error);
		await interaction.editReply({
			content: "Något gick fel, var vänlig försök igen.",
		});
		return;
	}
};
