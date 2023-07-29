import { Guild, User } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { getChannelsInCategory } from "../../../../shared/utils/category";
import { joinableCommunityChannels } from "../utils";

export const handleCommunityJoin = async (
	interaction: GuildChatInputCommandInteraction,
	community: string
): Promise<void> => {
	const { guild, user } = interaction;
	try {
		await joinCommunity(community, guild, user);
		await interaction.editReply({
			content: `Joined community ${community}!`,
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

const joinCommunity = async (
	searchCategory: string,
	guild: Guild,
	user: User
): Promise<void> => {
	const channels = await getChannelsInCategory(
		guild,
		searchCategory,
		joinableCommunityChannels
	);

	channels.forEach(async (channel) => {
		await channel?.permissionOverwrites.create(user, {
			ViewChannel: true,
		});
	});
};
