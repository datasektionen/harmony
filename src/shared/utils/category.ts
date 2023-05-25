import {
	ChannelType,
	Collection,
	Guild,
	NonThreadGuildBasedChannel,
} from "discord.js";

export const getChannelsInCategory = async (
	guild: Guild,
	categoryName: string,
	channelsFilter?: string[]
): Promise<Collection<string, NonThreadGuildBasedChannel | null>> => {
	const allGuildChannels = await guild.channels.fetch();
	if (!allGuildChannels) throw new Error("No channels found");

	const category = allGuildChannels
		.filter(
			(channel) =>
				channel?.type === ChannelType.GuildCategory &&
				channel?.name.includes(categoryName)
		)
		.first();
	if (!category) throw new Error("Category not found");

	const channels = allGuildChannels.filter(
		(channel) =>
			channel?.parentId === category.id &&
			// Check channels to join if specified
			(channelsFilter
				? channelsFilter.some((name) => channel.name.includes(name))
				: true)
	);

	return channels;
};
