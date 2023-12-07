import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { hasRole } from "../../shared/utils/roles";
import { ClubSubcommandNames } from "./club-subcommands.names";
import { ClubVariables } from "./subcommands/club.variables";
import { handleClubGive } from "./subcommands/give/club-give.handler";
import { handleClubRemove } from "./subcommands/remove/club-remove.handler";
import { canBeGivenBy, canGiveRole, isRole } from "./subcommands/utils";
import { User, Guild } from "discord.js";


export const handleClub = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options, user, guild } = interaction;
	await interaction.deferReply({ ephemeral: true });

	const clubParam = options.getString(ClubVariables.CLUB, true);
	const targetUser = options.getUser(ClubVariables.TARGET, true);

	if (!isRole(clubParam)) {
		await interaction.editReply({
			content: "Please enter a valid club name.",
		});
		return;
	} else if (!userCanGiveRole(user, clubParam, guild)) {
		await interaction.editReply({
			content: "You cannot give or remove this role!"
		});
		return;
	}
	
	const subCommandName = interaction.options.getSubcommand(true);
	switch (subCommandName) {
		case ClubSubcommandNames.GIVE:
			return await handleClubGive(interaction, clubParam, targetUser);
		case ClubSubcommandNames.REMOVE:
			return await handleClubRemove(interaction, clubParam, targetUser);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};

const userCanGiveRole = async (user: User, role: string, guild: Guild): Promise<Boolean> => {
	for (const allowedRole of canBeGivenBy.get(role)) {
		if (await hasRole(user, allowedRole, guild)) {
			return true;
		}
	}
	return false;
}
