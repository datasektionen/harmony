import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands.names";
import { ButtonsSubcommands } from "./buttons-subcommands.names";

const command = new SlashCommandBuilder()
	.setName(CommandNames.BUTTONS)
	.setDescription("Generate buttons")
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

command.addSubcommand((subCommand) =>
	subCommand
		.setName(ButtonsSubcommands.COURSES)
		.setDescription(
			"Generate buttons for joining or leaving courses belonging to e.g. a certain year or master"
		)
);

command.addSubcommand((subCommand) =>
	subCommand
		.setName(ButtonsSubcommands.VERIFY)
		.setDescription("Generate buttons for verify subcommand modals")
);

export const buttonsCommand = command;
