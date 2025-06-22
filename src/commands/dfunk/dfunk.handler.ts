import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { DfunkSubcommands } from "./dfunk-subcommands";
import { handleDfunkTest } from "./subcommands/test/dfunk-test.handler";
import { handleDfunkUpdate } from "./subcommands/update/dfunk-update.handler";

export async function handleDfunk(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);

	switch (subcommandName) {
		case DfunkSubcommands.UPDATE:
			return await handleDfunkUpdate(interaction);
		case DfunkSubcommands.TEST:
			return await handleDfunkTest(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
}
