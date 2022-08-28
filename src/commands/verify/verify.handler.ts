import { ChatInputCommandInteraction } from "discord.js";
import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { handleVerifyBegin } from "./subcommands/begin/verify-begin.handler";
import { handleVerifySubmit } from "./subcommands/submit/verify-submit.handler";
import { VerifySubcommandNames } from "./verify-subcommands.names";

export const handleVerify = async (
	interaction: ChatInputCommandInteraction
) => {
	const subCommandName = interaction.options.getSubcommand(true);

	switch (subCommandName) {
		case VerifySubcommandNames.BEGIN:
			return await handleVerifyBegin(interaction);
		case VerifySubcommandNames.SUBMIT:
			return await handleVerifySubmit(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};
