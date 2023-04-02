import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { handleCommunityJoin } from "./subcommands/join/community-join.handler";
import { handleCommunityLeave } from "./subcommands/leave/community-leave.handler";
import { CommunitySubcommandNames } from "./community-subcommands.names";
import { CommunityVariables } from "./subcommands/community.variables";
import { isCommunity } from "./subcommands/utils";

export const handleCommunity = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	await interaction.deferReply({ ephemeral: true });
	const messageText = options.getString(CommunityVariables.COMMUNITY, true);
	if (!isCommunity(messageText)) {
		await interaction.editReply({
			content: "Please enter a valid community name.",
		});
		return;
	}

	const subCommandName = interaction.options.getSubcommand(true);

	switch (subCommandName) {
		case CommunitySubcommandNames.JOIN:
			return await handleCommunityJoin(interaction, messageText);
		case CommunitySubcommandNames.LEAVE:
			return await handleCommunityLeave(interaction, messageText);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};
