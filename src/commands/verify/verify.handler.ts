import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { handleVerifyBegin } from "./subcommands/verify-begin.handler";
import { handleVerifySubmit } from "./subcommands/verify-submit.handler";
import { VerifySubcommandNames } from "./verify-subcommands-names.enum";

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
			throw new Error(`Command name not found ${interaction.commandName}`);
	}
};
