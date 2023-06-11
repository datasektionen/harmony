import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { readFile, writeFile } from "fs";

// Switches between mottagningsmode and default mode
export const handleMottagningsmode = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    // Read current mode
    let mode = "default";
    readFile("../../shared/assets/mode.txt", (err, data) => {
        if (err) // File does not exist, mottagningsmode is not on
            return;
        mode = data.toString();
    });

    // Switch to opposite mode
    if (mode === "default")
        mode = "mottagning";
    else {
        mode = "default";
    }

    writeFile("../../shared/assets/mode.txt", mode, err => {
        if (err)
            console.warn(err);
    });

    await interaction.reply({
        content: "Harmony is now in mode: " + mode,
        ephemeral: true,
    });
    return;
};
