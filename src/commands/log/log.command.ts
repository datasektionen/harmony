import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { LogSubcommandNames } from "./log-subcommands.names";
import { LogVariables } from "./subcommands/log.variables";

export const logCommand = new SlashCommandBuilder()
	.setName(CommandNames.LOG)
	.setDescription(
		// Note: General command description is not shown if the command has sub command.
		//       This description is therefore not shown to users.
		"Configure a channel to be a log channel for harmony."
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

logCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(LogSubcommandNames.CHANNEL)
		.setDescription(
			"Set target channel as log channel for harmony."
		)
		.addChannelOption((option) =>
			option
				.setName(LogVariables.CHANNEL)
				.setDescription(
					"Target channel."
				)
				.setRequired(true)
		)
);
