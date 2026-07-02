import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { NoticeSetChannelVariables } from "./notice-set-channel.variables";

export const handleNoticeSetChannel = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    const { options } = interaction;

    const channel = options.getChannel(
        NoticeSetChannelVariables.CHANNEL_ID,
        true
    );
    await interaction.editReply({
        content: `Notice-channel set to ${channel.toString()}`,
    });
};
