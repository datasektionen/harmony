import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { getState } from "../../../../shared/utils/state";

export const handleMottagningsmodeStatus = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await interaction.deferReply({ ephemeral: true });
    const mode = await getState(); // Read current mode
    await interaction.editReply({
        content: "Harmony is currently in mode: " + mode,
    });
    return;
};
