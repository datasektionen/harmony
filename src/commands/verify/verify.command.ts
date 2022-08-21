import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../command.names";
import { VerifyCommandNames } from "./subcommands/verify_command.names";

export const verifyCommand = new SlashCommandBuilder()
	.setName(CommandNames.VERIFY)
	.setDescription(
		"Automatically verifies that you are a kth student via @kth.se email"
	);

verifyCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(VerifyCommandNames.BEGIN)
		.setDescription("Enter your @kth.se address to receive a verification code")
		.addStringOption((option) =>
			option
				.setName("email")
				.setDescription("Your @kth address")
				.setRequired(true)
		)
);

verifyCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(VerifyCommandNames.SUBMIT)
		.setDescription("Verifies you with the code sent to your email")
		.addStringOption((option) =>
			option
				.setName("verification-code")
				.setDescription("The code sent to your email address")
				.setRequired(true)
		)
);
