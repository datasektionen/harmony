import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { joinLeaveCommunity } from "../utils";

export const handleCommunityLeave = async (
	interaction: GuildChatInputCommandInteraction,
	community: string,
	isMasterCommunity: boolean
): Promise<void> => {
	const { guild, user } = interaction;
	try {
		await joinLeaveCommunity(
			community,
			guild,
			user,
			isMasterCommunity,
			false
		);
		await interaction.editReply({
			content: `Left community ${community}!`,
		});
	} catch (error) {
		if (error instanceof Error) {
			await interaction.editReply({
				content: error.message,
			});
		} else {
			await interaction.editReply({
				content: "An unknown error occured!",
			});
		}
	}
};
