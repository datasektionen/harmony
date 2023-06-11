import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { getState, setState } from "../../shared/utils/state";

// Switches between mottagningsmode and default mode
export const handleMottagningsmode = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    let mode = getState(); // Read current mode

    // Switch to opposite mode
    if (mode === "default")
        mode = "mottagning";
    else {
        mode = "default";
    }
    setState(mode);

    await interaction.reply({
        content: "Harmony is now in mode: " + mode,
        ephemeral: true,
    });
    return;
};
