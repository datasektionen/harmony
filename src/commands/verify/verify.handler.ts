import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import { handleVerifyBegin } from "./subcommands/verify-begin.handler";
import { VerifySubcommandNames } from "./verify-subcommands-names.enum";
import { handleVerifySubmit } from "./subcommands/verify-submit.handler";

export const handleVerify = async (
	interaction: ChatInputCommandInteraction
) => {
	const subCommandName = interaction.options.getSubcommand(true);

	switch (subCommandName) {
		case VerifySubcommandNames.BEGIN:
			await handleVerifyBegin(interaction);
			break;
		case VerifySubcommandNames.SUBMIT:
			await handleVerifySubmit(interaction);
			break;
	}
};
