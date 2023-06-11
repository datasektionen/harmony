import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handleMottagningsmode = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await interaction.reply({
        content: "pong",
        ephemeral: true,
    });
    return;
};
