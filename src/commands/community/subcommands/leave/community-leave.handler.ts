import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { leaveCategoryChannels } from "../../../../shared/utils/category";

export const handleCommunityLeave = async (
	interaction: GuildChatInputCommandInteraction,
	messageText: string
): Promise<void> => {
	const { guild, user } = interaction;
	try {
		await leaveCategoryChannels(messageText, guild, user);
		await interaction.editReply({
			content: "Left community",
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
