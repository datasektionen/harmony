import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { VerifyBeginVariables } from "./subcommands/begin/verify-begin.variables";
import { VerifySubmitVariables } from "./subcommands/submit/verify-submit.variables";
import { VerifySubcommandNames } from "./verify-subcommands.names";
import { VerifyNollanVariables } from "./subcommands/nollan/verify-nollan.variables"

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
		.setDescription("Complete verification using the verification code sent to your KTH email")
		.addStringOption((option) =>
			option
				.setName(VerifySubmitVariables.VERIFICATION_CODE)
				.setDescription("The code sent to your KTH email address")
				.setRequired(true)
		)
);

// let clone: SlashCommandBuilder = Object.assign(Object.create(Object.getPrototypeOf(verifyCommand)), verifyCommand)

verifyCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(VerifySubcommandNames.NOLLAN)
		.setDescription("Verifiera dig på servern med den hemliga koden du fick från din dadda")
		.addStringOption((option) =>
			option
				.setName(VerifyNollanVariables.NOLLE_KOD)
				.setDescription("Den hemliga koden du fick från din dadda")
				.setRequired(true)
		)
);