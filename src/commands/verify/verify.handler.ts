import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { handleVerifyBegin } from "./subcommands/begin/verify-begin.handler";
import { handleVerifyNollan } from "./subcommands/nollan/verify-nollan.handler";
import { handleVerifySubmit } from "./subcommands/submit/verify-submit.handler";
import { VerifySubcommandNames } from "./verify-subcommands.names";
import { isMottagningsModeActive } from "../../shared/utils/state";
import { clientIsLight } from "../../shared/types/light-client";

export const handleVerify = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const subCommandName = interaction.options.getSubcommand(true);
	const light = clientIsLight(interaction.client)

	if (await isMottagningsModeActive()) {
		let validCommands = Object.values(VerifySubcommandNames) as string[]; // Get all valid command names
		if (subCommandName === VerifySubcommandNames.NOLLAN && !light)
			return await handleVerifyNollan(interaction);
		else if (validCommands.includes(subCommandName))
			interaction.reply({ content: "You can't verify with KTH email during the reception!", ephemeral: true })
		else
			throw new CommandNotFoundError(interaction.commandName);
	} else {
		switch (subCommandName) {
			case VerifySubcommandNames.BEGIN:
				return await handleVerifyBegin(interaction);
			case VerifySubcommandNames.SUBMIT:
				return await handleVerifySubmit(interaction);
			case VerifySubcommandNames.NOLLAN:
				interaction.reply({ content: "Nøllan has already been dealt with...", ephemeral: true })
				return;
			default:
				throw new CommandNotFoundError(interaction.commandName);
		}
	}
};
