import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import { handleVerifyBegin } from "./subcommands/verify_begin.handler";
import { VerifyCommandNames } from "./subcommands/verify_command.names";
import { handleVerifySubmit } from "./subcommands/verify_submit.handler";

export const handleVerify = async (
	interaction: ChatInputCommandInteraction
) => {
	const subCommandName = interaction.options.getSubcommand(true);

	switch (subCommandName) {
		case VerifyCommandNames.BEGIN:
			await handleVerifyBegin(interaction);
			break;
		case VerifyCommandNames.SUBMIT:
			await handleVerifySubmit(interaction);
			break;
	}
};
