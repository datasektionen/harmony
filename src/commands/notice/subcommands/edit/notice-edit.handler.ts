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
	) as ThreadChannel; // notice.commands.ts already ensures this, cast only used in order to make TypeScript comply
	const updatedMessage = options.getString(
		NoticeEditVariables.NEW_MESSAGE,
		true
	);

	if (thread.parentId !== channelId) {
		await interaction.editReply({
			content:
				"Please only select threads belonging to the notice-channel",
		});
	} else {
		// TODO
		await interaction.editReply({
			content: "This feature does not exist yet!",
		});
	}
};
