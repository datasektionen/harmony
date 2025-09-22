import { MessageFlags } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { MottagningenSubcommands } from "./mottagningen-subcommands.names";
import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { handleMottagningenClear } from "./subcommands/clear/mottagningen-clear.handler";
import { handleMottagningenEnd } from "./subcommands/end/mottagningen-end.handler";

export async function handleMottagningen(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const subcommandName = interaction.options.getSubcommand(true);
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    switch (subcommandName) {
        case MottagningenSubcommands.CLEAR:
            return await handleMottagningenClear(interaction);
        case MottagningenSubcommands.END:
            return await handleMottagningenEnd(interaction);
        default:
            throw new CommandNotFoundError(interaction.commandName);
    }
}