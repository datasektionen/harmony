import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { handleChannel } from "../../../../shared/utils/channel-utils";
import {
	setPingRoles,
	setRoleVerified,
	setYearRoles,
	setNollegruppRoles,
} from "../../../../shared/utils/roles";
import { verifyNolleCode } from "../../../../shared/utils/verify_nolle_code";
import { joinChannel } from "../../../join/join.handler";
import { messageIsToken } from "../util";
import { VerifyNollanVariables } from "./verify-nollan.variables";

export const handleVerifyNollan = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { user, options } = interaction;
	await interaction.deferReply({ ephemeral: true });
	const code = options.getString(VerifyNollanVariables.NOLLE_KOD, true);
	
	// Check if code is valid
	const validNollegruppRoleNames = verifyNolleCode(code);
	if (!validNollegruppRoleNames) {
		await interaction.editReply({
			content: "Ogiltig kod",
		});
		return;
	}

	try {
		await setRoleVerified(user, interaction.guild);

		const year = new Date().getFullYear();
		const yearRole = "D-" + year.toString()[2] + year.toString()[3];

		await setYearRoles(user, yearRole, interaction.guild);

		// Join all pre-NG courses
		// sf0003, sf1671, dd1337, da1600
		const courseCodes = ["sf0003", "sf1671", "dd1337", "da1600"];

		await Promise.all(
			courseCodes.map(async (code) => {
				try {
					await handleChannel(code, interaction, joinChannel, true);
				} catch {
					console.log("Couldn't join channel: " + code);
				}
			})
		);

		// Add all ping roles
		await setPingRoles(user, interaction.guild);

		// Add n0llegrupps roles
		await setNollegruppRoles(user, validNollegruppRoleNames, interaction.guild);

		await interaction.editReply({ content: "Välkommen nøllan! Du har nu blivit tillagd i några kanaler, inklusive kanaler för de första kurserna. Ha kul med schlemandet!" });
	} catch (error) {
		console.warn(error);
		await interaction.editReply({
			content: "Något gick fel, var vänlig försök igen.",
		});
		return;
	}
};
