import { Env } from "../../../..";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { isMottagningsModeActive, setState } from "../../../../shared/utils/state";
import { registerCommands } from "../../../register-commands";

export const handleMottagningsmodeDisable = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await interaction.deferReply();
    const mottagningOn = await isMottagningsModeActive(); // Read current mode
    const newMode = "default";
    const env = process.env.NODE_ENV as Env;

    if (mottagningOn) {
        await setState(newMode);
        await registerCommands(env);
        await interaction.editReply({
            content: "Harmony is now in mode: " + newMode,
        });
    } else {
        await interaction.editReply({
            content: "Mottagnings-mode is already disabled"
        });
    }
    return;
};
