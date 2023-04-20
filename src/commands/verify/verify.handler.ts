import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { handleVerifyBegin } from "./subcommands/begin/verify-begin.handler";
import { handleVerifyNollan } from "./subcommands/nollan/verify-nollan.handler";
import { handleVerifySubmit } from "./subcommands/submit/verify-submit.handler";
import { VerifySubcommandNames } from "./verify-subcommands.names";

export const handleVerify = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const subCommandName = interaction.options.getSubcommand(true);

	switch (subCommandName) {
		case VerifySubcommandNames.BEGIN:
			return await handleVerifyBegin(interaction);
		case VerifySubcommandNames.SUBMIT:
			return await handleVerifySubmit(interaction);
		case VerifySubcommandNames.NOLLAN:
			return await handleVerifyNollan(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};
