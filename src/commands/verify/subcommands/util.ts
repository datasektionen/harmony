import { Interaction } from "discord.js";
import { verifiedUsers } from "../../../database-config";
import { extractYearFromUser, setExternRole, setPingRoles, setRoleVerified, setYearRoles } from "../../../shared/utils/roles";
import { mapYearToAlias } from "../../../shared/utils/alias_to_year_mapper";
import { handleChannelAlias } from "../../../shared/utils/channel-utils";
import { GuildChatInputCommandInteraction } from "../../../shared/types/GuildChatInputCommandType";
import { joinChannel } from "../../join/join.handler";

export const isKthEmail = (messageText: string): boolean =>
	new RegExp(/^[a-zA-Z0-9]+@kth[.]se$/).test(messageText);

export const messageIsToken = (messageText: string): RegExpMatchArray | null =>
	messageText.match(/^[a-zA-Z0-9_-]+$/);

export const verifyUser = async (
	interaction: GuildChatInputCommandInteraction, 
	emailAddress: string, 
	discordId: string
): Promise<void> => {
	const user = interaction.user;
	verifiedUsers.set(discordId, emailAddress);
	console.log(`Verified user by kth email. email="${emailAddress}" user.id="${user.id}" user.username="${user.username}"`);
	try {
		await setRoleVerified(user, interaction.guild);
		const { year, yearRole } = await extractYearFromUser(emailAddress);
		if (yearRole && year) {
			await setYearRoles(user, yearRole, interaction.guild);
			const alias = mapYearToAlias(year);
			if (alias) await handleChannelAlias(alias, interaction, joinChannel);
		} else setExternRole(user, interaction.guild);

		// Add all ping roles
		await setPingRoles(user, interaction.guild);
	} catch (error) {
		console.warn(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
		return;
	}
}
