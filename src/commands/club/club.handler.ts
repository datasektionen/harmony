import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { getRoles, hasRole } from "../../shared/utils/roles";
import { ClubSubcommandNames } from "./club-subcommands.names";
import { ClubVariables } from "./subcommands/club.variables";
import { handleClubGive } from "./subcommands/give/club-give.handler";
import { handleClubList } from "./subcommands/list/club-list.handler";
import { handleClubRemove } from "./subcommands/remove/club-remove.handler";
import { canBeGivenBy, isRole } from "./subcommands/utils";
import { User, Guild, MessageFlags } from "discord.js";

export const handleClub = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options, user, guild } = interaction;
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	const clubParam = options.getString(ClubVariables.ROLE, true);

	if (!isRole(clubParam)) {
		await interaction.editReply({
			content:
				"Please enter a valid role: " +
				Object.keys(canBeGivenBy).join(", ") +
				".",
		});
		return;
	} else if (!(await userCanGiveRole(user, clubParam, guild))) {
		await interaction.editReply({
			content:
				`You cannot give or remove this role! ${clubParam} can only be administrated by users with the following roles: ` +
				canBeGivenBy[clubParam]?.join(", ") +
				". You have the following roles: " +
				(await getRoles(user, guild)).join(", ") +
				".",
		});
		return;
	}

	const subCommandName = interaction.options.getSubcommand(true);
	switch (subCommandName) {
		case ClubSubcommandNames.GIVE:
			return await handleClubGive(interaction, clubParam);
		case ClubSubcommandNames.REMOVE:
			return await handleClubRemove(interaction, clubParam);
		case ClubSubcommandNames.LIST:
			return await handleClubList(interaction, clubParam);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};

/**
 * Checks if a user can give a specific role in a guild.
 * @param user The user to check.
 * @param role The role to check if it can be given.
 * @param guild The guild to check in.
 * @returns A promise that resolves to a boolean indicating if the user can give the role.
 */
const userCanGiveRole = async (
	user: User,
	role: string,
	guild: Guild
): Promise<boolean> => {
	if (await hasRole(user, "Admin", guild)) {
		return true;
	}
	for (const allowedRole of canBeGivenBy[role]) {
		if (await hasRole(user, allowedRole, guild)) {
			return true;
		}
	}
	return false;
};
