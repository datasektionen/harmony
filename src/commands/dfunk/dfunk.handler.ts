import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { DfunkSubcommands } from "./dfunk-subcommands";
import { handleDfunkTest } from "./subcommands/test/dfunk-test.handler";
import { handleDfunkUpdate } from "./subcommands/update/dfunk-update.handler";
import { handleDfunkToggle } from "./subcommands/toggle/dfunk-toggle.handler";
import { handleDfunkStatus } from "./subcommands/status/dfunk-status.handler";

export async function handleDfunk(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);

	switch (subcommandName) {
		case DfunkSubcommands.UPDATE:
			return await handleDfunkUpdate(interaction);
		case DfunkSubcommands.TEST:
			return await handleDfunkTest(interaction);
		case DfunkSubcommands.STATUS:
			return await handleDfunkStatus(interaction);
		case DfunkSubcommands.TOGGLE:
			return await handleDfunkToggle(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
}
