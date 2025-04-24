import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { NollegruppSubcommands } from "./nollegrupp-subcommands.names";
import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { MessageFlags } from "discord.js";
import { handleNollegruppList } from "./subcommands/list/nollegrupp-list.handler";
import { handleNollegruppAdd } from "./subcommands/add/nollegrupp-add.handler";
import { handleNollegruppRemove } from "./subcommands/remove/nollegrupp-remove.handler";
import { handleNollegruppClear } from "./subcommands/clear/nollegrupp-clear.handler";

export async function handleNollegrupp(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	switch (subcommandName) {
		case NollegruppSubcommands.ADD:
			return handleNollegruppAdd(interaction);
		case NollegruppSubcommands.CLEAR:
			return handleNollegruppClear(interaction);
		case NollegruppSubcommands.LIST:
			return handleNollegruppList(interaction);
		case NollegruppSubcommands.REMOVE:
			return handleNollegruppRemove(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
}
