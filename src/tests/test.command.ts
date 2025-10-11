import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TestSubcommands } from "./test-subcommands";

const command = new SlashCommandBuilder()
	.setName("test")
	.setDescription("Command to execute tests.")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

// Add your subcommands here, i.e.
// command.addSubcommand((subCommand) =>
// 	subCommand
// 		.setName(TestSubcommands.COMMAND_NAME)
// 		.setDescription("subcommand description.")
// );

export const testCommand = command;
// Some change