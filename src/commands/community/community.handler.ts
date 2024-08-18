import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { handleCommunityJoin } from "./subcommands/join/community-join.handler";
import { handleCommunityLeave } from "./subcommands/leave/community-leave.handler";
import { CommunitySubcommandNames } from "./community-subcommands.names";
import { CommunityVariables } from "./subcommands/community.variables";
import { communityYear, getCommunityCategory, isMaster, isYear } from "./subcommands/utils";
import { hasRole } from "../../shared/utils/roles";

export const handleCommunity = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options, user, guild } = interaction;
	await interaction.deferReply({ ephemeral: true });

	const communityParam = options.getString(CommunityVariables.COMMUNITY, true);
	const paramIsMaster = isMaster(communityParam);
	const paramIsYear = isYear(communityParam);

	if (!paramIsYear && !paramIsMaster) {
		await interaction.editReply({
			content: "Please enter a valid community name.",
		});
		return;
	}

	// Convert to a correct community category name
	const community = getCommunityCategory(communityParam, paramIsYear);

	if (paramIsYear && await hasRole(user, community, guild)) {
		// Check if user is native member of the community (not applied to masters)
		await interaction.editReply({
			content: "You cannot join or leave your own class community!"
		});
		return;
	}

	const subCommandName = interaction.options.getSubcommand(true);
	switch (subCommandName) {
		case CommunitySubcommandNames.JOIN:
			return await handleCommunityJoin(interaction, community, paramIsMaster);
		case CommunitySubcommandNames.LEAVE:
			return await handleCommunityLeave(interaction, community, paramIsMaster);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};
