import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { joinCategoryChannels } from "../../../../shared/utils/category";

export const handleCommunityJoin = async (
	interaction: GuildChatInputCommandInteraction,
	messageText: string
): Promise<void> => {
	const { guild, user } = interaction;
	try {
		await joinCategoryChannels(messageText, guild, user);
		await interaction.editReply({
			content: "Joined community",
		});
	} catch (error) {
		if (error instanceof Error) {
			await interaction.editReply({
				content: error.message,
			});
		} else {
			await interaction.editReply({
				content: "An unkown error occured",
			});
		}
	}
};
