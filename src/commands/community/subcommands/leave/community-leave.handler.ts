import { Guild, User } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { getChannelsInCategory } from "../../../../shared/utils/category";
import { joinableCommunityChannels } from "../utils";

export const handleCommunityLeave = async (
	interaction: GuildChatInputCommandInteraction,
	community: string
): Promise<void> => {
	const { guild, user } = interaction;
	try {
		await leaveCommunity(community, guild, user);
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

const leaveCommunity = async (
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
			ViewChannel: false,
		});
	});
};
