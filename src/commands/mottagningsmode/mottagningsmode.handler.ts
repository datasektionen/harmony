import { Env } from "../..";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { getState, setState } from "../../shared/utils/state";
import { registerCommands } from "../register-commands";

// Switches between mottagningsmode and default mode
export const handleMottagningsmode = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    let mode = await getState(); // Read current mode
    const env = process.env.NODE_ENV as Env;

    // Switch to opposite mode
    if (mode === "default")
        mode = "mottagning";
    else {
        mode = "default";
    }
    await setState(mode);
    registerCommands(env);

    await interaction.reply({
        content: "Harmony is now in mode: " + mode,
    });
    return;
};
