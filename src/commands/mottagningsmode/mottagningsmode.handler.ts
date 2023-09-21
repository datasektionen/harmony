import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { MottagningsmodeSubcommandNames } from "./mottagningsmode-subcommands.names";
import { handleMottagningsmodeDisable } from "./subcommands/disable/mottagningsmode-disable.handler";
import { handleMottagningsmodeEnable } from "./subcommands/enable/mottagningsmode-enable.handler";
import { handleMottagningsmodeStatus } from "./subcommands/status/mottagningsmode-status.handler";

export const handleMottagningsmode = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    const subCommandName = interaction.options.getSubcommand(true);

    switch (subCommandName) {
        case MottagningsmodeSubcommandNames.STATUS:
            return await handleMottagningsmodeStatus(interaction);
        case MottagningsmodeSubcommandNames.ENABLE:
            return await handleMottagningsmodeEnable(interaction);
        case MottagningsmodeSubcommandNames.DISABLE:
            return await handleMottagningsmodeDisable(interaction);
        default:
            throw new CommandNotFoundError(interaction.commandName);
    }
}
