import { Env } from "../../..";
import { GuildChatInputCommandInteraction } from "../../../shared/types/GuildChatInputCommandType";
import { isMottagningsModeActive, setState } from "../../../shared/utils/state";
import { registerCommands } from "../../register-commands";

export async function setMottagningsmode(enable: boolean): Promise<void> {
    const newMode = enable ? "mottagning" : "default";
    const env = process.env.NODE_ENV as Env;

    await setState(newMode);
    await registerCommands(env);
}

export const handleMottagningsmodeSet = async (
    interaction: GuildChatInputCommandInteraction,
    enable: boolean
): Promise<void> => {
    await interaction.deferReply();
    const mottagningOn = await isMottagningsModeActive(); // Read current mode
    const newMode = enable ? "mottagning" : "default";
    const shouldToggle = mottagningOn != enable;

    if (shouldToggle) {
        setMottagningsmode(enable);
        await interaction.editReply({
            content: `Harmony is now in mode: ${newMode}.`
        });
    } else {
        await interaction.editReply({
            content: `Mottagnings-mode is already ${enable ? "enabled" : "disabled"}.`
        });
    }
    return;
};
