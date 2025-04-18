import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { handleVerifyBegin } from "./subcommands/begin/verify-begin.handler";
import { handleVerifyNollan } from "./subcommands/nollan/verify-nollan.handler";
import { handleVerifySubmit } from "./subcommands/submit/verify-submit.handler";
import { VerifySubcommandNames } from "./verify-subcommands.names";
import { isDarkmode } from "../../shared/utils/darkmode";
import { clientIsLight } from "../../shared/types/light-client";
import { MessageFlags } from "discord.js";

export const handleVerify = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const subCommandName = interaction.options.getSubcommand(true);
	const light = clientIsLight(interaction.client);
	const darkmode = await isDarkmode();

	switch (subCommandName) {
		case VerifySubcommandNames.BEGIN:
			return await handleVerifyBegin(interaction, darkmode);
		case VerifySubcommandNames.SUBMIT:
			return await handleVerifySubmit(interaction);
		case VerifySubcommandNames.NOLLAN:
			if (darkmode && !light)
				return await handleVerifyNollan(interaction);
			else
				interaction.reply({
					content: "Nøllan has already been dealt with...",
					flags: MessageFlags.Ephemeral,
				});
			return;
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};
