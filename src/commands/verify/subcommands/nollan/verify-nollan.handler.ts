import {
	tokenDiscord,
	tokenEmail,
	verifiedUsers,
} from "../../../../database-config";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { mapYearToAlias } from "../../../../shared/utils/alias_to_year_mapper";
import { handleChannel } from "../../../../shared/utils/channel-utils";
import {
	extractYearFromUser,
	setExternRole,
	setPingRoles,
	setRoleVerified,
	setYearRoles,
	setNollegruppRoles,
} from "../../../../shared/utils/roles";
import { joinChannel } from "../../../join/join.handler";
import { messageIsToken } from "../util";
import { VerifyNollanVariables } from "./verify-nollan.variables";

export const handleVerifyNollan = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { user, options } = interaction;
	const messageText = options.getString(
		VerifyNollanVariables.VERIFICATION_CODE,
		true
	);

	if (!messageIsToken(messageText)) {
		await interaction.reply({
			content: "Ogiltig kod",
			ephemeral: true,
		});
		return;
	}

	const [discordId, emailAddress] = await Promise.all([
		tokenDiscord.get(messageText) as Promise<string | undefined>,
		tokenEmail.get(messageText) as Promise<string | undefined>,
	]);

	if (!discordId || discordId !== user.id) {
		await interaction.reply({
			content:
				"Verifikationen misslyckades, prova igen.",
			ephemeral: true,
		});
		return;
	}

	verifiedUsers.set(discordId, "isNollan");
	try {
		await setRoleVerified(user, interaction.guild);
		await interaction.reply({
			content:
				"You are now verified! You have been added to all course channels of your current year. \nYou can join or leave course channels with the `/join` and `/leave` command. \nFor more info, see: <#1020725853157593219>",
			ephemeral: true,
		});
		const year = new Date().getFullYear();
		const yearRole = "D-" + year.toString()[2] + year.toString()[3];

		await setYearRoles(user, yearRole, interaction.guild);

		// Join all pre-NG courses
		// sf0003, sf1671, dd1337, da1600
		const courseCodes = ["sf0003", "sf1671", "dd1337", "da1600"]
		courseCodes.forEach(code => {
			handleChannel(code, interaction, joinChannel);
		});

		// Add all ping roles
		await setPingRoles(user, interaction.guild);

		// Add n0llegrupps roles
		await setNollegruppRoles(user, interaction.guild);

	} catch (error) {
		console.warn(error);
		await interaction.reply({
			content: "Något gick fel, var vänlig försök igen.",
			ephemeral: true,
		});
		return;
	}
};
