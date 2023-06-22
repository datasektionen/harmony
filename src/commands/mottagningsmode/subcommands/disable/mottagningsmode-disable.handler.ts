import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { handleMottagningsmodeSet } from "../common";

export const handleMottagningsmodeDisable = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await handleMottagningsmodeSet(interaction, false);
};
