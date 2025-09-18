import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands.names";
import { DfunkSubcommands } from "./dfunk-subcommands";

const command = new SlashCommandBuilder()
	.setName(CommandNames.DFUNK)
	.setDescription("Command related to the dfunk automatic update.")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

command.addSubcommand((subCommand) =>
	subCommand
		.setName(DfunkSubcommands.UPDATE)
		.setDescription("Manually start the dfunk role update routine.")
);

command.addSubcommand((subCommand) =>
	subCommand
		.setName(DfunkSubcommands.TEST)
		.setDescription("Start the dfunk role update test routine.")
);

command.addSubcommand((subCommand) =>
	subCommand
		.setName(DfunkSubcommands.TOGGLE)
		.setDescription("Toggles the automatic dfunk role update routine.")
);

command.addSubcommand((subCommand) =>
	subCommand
		.setName(DfunkSubcommands.STATUS)
		.setDescription(
			"Reveals the current status of the automatic dfunk role update."
		)
);

export const dfunkCommand = command;
