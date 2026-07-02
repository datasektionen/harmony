import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { NoticeSendVariables } from "./notice-send.variables";

export const handleNoticeSend = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    const { options } = interaction;
    const user = options.getUser(NoticeSendVariables.USER, true);
    const message = options.getString(NoticeSendVariables.MESSAGE, true);
    await interaction.editReply({
        content: `Sending "${message}" to ${user.tag}`,
    });
};
