import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { isMottagningsModeActive } from "../../../../shared/utils/state";
import { toggleMottagningsmode } from "../common";

export const handleMottagningsmodeEnable = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await interaction.deferReply();
    const mottagningOn = await isMottagningsModeActive(); // Read current mode
    const newMode = "mottagning";

    if (!mottagningOn) {
        toggleMottagningsmode();
        await interaction.editReply({
            content: "Harmony is now in mode: " + newMode,
        });
    } else {
        await interaction.editReply({
            content: "Mottagnings-mode is already enabled"
        });
    }
   
    return;
};