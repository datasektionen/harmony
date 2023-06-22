import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { handleMottagningsmodeSet } from "../common";

export const handleMottagningsmodeEnable = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await handleMottagningsmodeSet(interaction, true);
};
