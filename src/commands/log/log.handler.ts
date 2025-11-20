import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { LogSubcommandNames } from "./log-subcommands.names";
import { handleLogChannel } from "./subcommands/channel/log-channel.handler";

export const handleLog = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const subCommandName = interaction.options.getSubcommand(true);
	switch (subCommandName) {
		case LogSubcommandNames.CHANNEL:
			return await handleLogChannel(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};