import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { VerifyBeginVariables } from "./subcommands/begin/verify-begin.variables";
import { VerifySubmitVariables } from "./subcommands/submit/verify-submit.variables";
import { VerifySubcommandNames } from "./verify-subcommands.names";

export const verifyCommand = new SlashCommandBuilder()
	.setName(CommandNames.VERIFY)
	.setDescription(
		// Note: General command description is not shown if the command has sub command.
		//       This description is therefore not show to users.
		"Verify that you are a KTH student via @kth.se email" 
	);                                                                      
verifyCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(VerifySubcommandNames.BEGIN)
		.setDescription("Enter your @kth.se email address to receive a verification code")
		.addStringOption((option) =>
			option
				.setName(VerifyBeginVariables.EMAIL)
				.setDescription("Your @kth.se email address")
				.setRequired(true)
		)
);

verifyCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(VerifySubcommandNames.SUBMIT)
		.setDescription("Verifies you with the code sent to your email")
		.addStringOption((option) =>
			option
				.setName(VerifySubmitVariables.VERIFICATION_CODE)
				.setDescription("The code sent to your email address")
				.setRequired(true)
		)
);
