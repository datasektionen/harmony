import { getNoticeChannel } from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { NoticeSendVariables } from "./notice-send.variables";

export const handleNoticeSend = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const user = options.getUser(NoticeSendVariables.USER, true);
	const message = options.getString(NoticeSendVariables.MESSAGE, true);
	const channelId = await getNoticeChannel(interaction.guildId!);

	if (!channelId) {
		await interaction.editReply({
			content:
				"No notice channel has been configured. Use `/notice set-channel` first.",
		});
	} else {
		const channel = await interaction.guild!.channels.fetch(channelId);
		if (!channel?.isTextBased()) {
    		await interaction.editReply({
        		content: "The configured notice channel no longer exists."
    		});
		} else {
			await channel.send(
				`${user} \n${message}`
			);
			await interaction.editReply({
				content: `Sent a notice to ${user}`,
			});
		}
	}
};
