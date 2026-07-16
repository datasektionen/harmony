import { ChannelType, ThreadAutoArchiveDuration } from "discord.js";
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
		if (channel?.type !== ChannelType.GuildText) {
			await interaction.editReply({
				content:
					"The configured notice channel either no longer exists, or is of an unsupported channel type.",
			});
		} else {
			const thread = await channel.threads.create({
				name: `Notice ${user.tag}`,
				autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
				type: ChannelType.PrivateThread,
				invitable: false,
			});
			await thread.send(`${message}\n\n${user}`);
			await interaction.editReply({
				content: `Sent a notice to ${user}`,
			});
		}
	}
};
