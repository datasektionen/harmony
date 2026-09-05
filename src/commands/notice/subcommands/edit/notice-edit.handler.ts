import { ThreadChannel } from "discord.js";
import { getNoticeChannel } from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { NoticeEditVariables } from "./notice-edit.variables";

export const handleNoticeEdit = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const channelId = await getNoticeChannel(interaction.guildId!);
	const thread = options.getChannel(
		NoticeEditVariables.NOTICE_THREAD,
		true
	) as ThreadChannel;

	// notice.commands.ts already ensures this, cast only used in order to make TypeScript comply
	const updatedMessage = options.getString(
		NoticeEditVariables.NEW_MESSAGE,
		true
	);

	if (thread.parentId !== channelId) {
		await interaction.editReply({
			content:
				"Please only select threads belonging to the notice channel",
		});
	} else {
		// Find oldest message from the bot in the thread, this will always be the message we want to edit
		const messages = await thread.messages.fetch({ limit: 100 });
		const noticeMessage = [...messages.values()]
			.reverse()
			.find(
				(message) => message.author.id === interaction.client.user.id
			);

		if (!noticeMessage) {
			await interaction.editReply({
				content:
					"Could not find the notice message in this thread. If the thread has more than 100 messages, it is no longer possible to edit the notice.",
			});
		} else {
			// We want to keep the mention of the user after editing
			const userMention = noticeMessage.mentions.users.first();
			await noticeMessage.edit({
				content: updatedMessage + `\n\n${userMention}`,
			});
			await interaction.editReply({
				content: `Notice ${thread} updated!`,
			});
		}
	}
};
