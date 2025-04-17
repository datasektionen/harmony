import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { NollegruppSubcommands } from "./nollegrupp-subcommands.names";
import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { MessageFlags } from "discord.js";
import { handleNollegruppList } from "./subcommands/list/nollegrupp-list.handler";

export async function handleNollegrupp(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const subcommandName = interaction.options.getSubcommand(true);
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // TODO
    switch (subcommandName) {
        case NollegruppSubcommands.ADD:
            return;
        case NollegruppSubcommands.LIST:
            return handleNollegruppList(interaction);
        case NollegruppSubcommands.REMOVE:
            return;
        default:
            throw new CommandNotFoundError(interaction.commandName);
    }
}