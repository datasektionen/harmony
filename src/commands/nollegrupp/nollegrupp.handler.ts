import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { NollegruppSubcommands } from "./nollegrupp-subcommands.names";
import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { MessageFlags } from "discord.js";

export async function handleNollegrupp(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const subcommandName = interaction.options.getSubcommand(true);
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    console.log("Shikanokonokonokokoshitantan")

    // TODO
    switch (subcommandName) {
        case NollegruppSubcommands.ADD:
            return;
        case NollegruppSubcommands.LIST:
            return;
        case NollegruppSubcommands.REMOVE:
            return;
        default:
            throw new CommandNotFoundError(interaction.commandName);
    }
}