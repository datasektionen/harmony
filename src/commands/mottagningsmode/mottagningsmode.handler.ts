import { Env } from "../..";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { getState, setState } from "../../shared/utils/state";
import { registerCommands } from "../register-commands";

// Switches between mottagningsmode and default mode
export const handleMottagningsmode = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    interaction.deferReply();
    let mode = await getState(); // Read current mode
    const env = process.env.NODE_ENV as Env;

    // Switch to opposite mode
    if (mode === "default")
        mode = "mottagning";
    else {
        mode = "default";
    }
    await setState(mode);
    await registerCommands(env);

    await interaction.editReply({
        content: "Harmony is now in mode: " + mode,
    });
    return;
};
