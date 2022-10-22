import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { VerifyBeginVariables } from "./subcommands/begin/verify-begin.variables";
import { VerifySubmitVariables } from "./subcommands/submit/verify-submit.variables";
import { VerifySubcommandNames } from "./verify-subcommands.names";

export const verifyCommand = new SlashCommandBuilder()
	.setName(CommandNames.VERIFY)
	.setDescription(
		"Automatically verifies that you are a kth student via @kth.se email"
	);

verifyCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(VerifySubcommandNames.BEGIN)
		.setDescription("Enter your @kth.se address to receive a verification code")
		.addStringOption((option) =>
			option
				.setName(VerifyBeginVariables.EMAIL)
				.setDescription("Your @kth address")
				.setRequired(true)
		)
);

verifyCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(VerifySubcommandNames.SUBMIT)
		.setDescription("Complete verification using the verification code sent to your KTH email")
		.addStringOption((option) =>
			option
				.setName(VerifySubmitVariables.VERIFICATION_CODE)
				.setDescription("The code sent to your KTH email address")
				.setRequired(true)
		)
);
