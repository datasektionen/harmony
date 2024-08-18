import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { PeriodSubcommandNames } from "./period-subcommands.names";
import { handlePeriodRoles } from "./subcommands/roles/period-roles.handler";

export const handlePeriod = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const subCommandName = interaction.options.getSubcommand(true);

	switch (subCommandName) {
		case PeriodSubcommandNames.ROLES:
			return await handlePeriodRoles(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
};
