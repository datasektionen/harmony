import { ChannelType, Collection, Guild, GuildBasedChannel, NonThreadGuildBasedChannel } from "discord.js";

export const getCategory = (
	categoryName: string,
	guild: Guild
): NonThreadGuildBasedChannel => {
	const category = guild.channels.cache.find(
		(channel) =>
			channel?.type === ChannelType.GuildCategory &&
			channel?.name.includes(categoryName)
	);
	if (!category)
		throw new Error(
			"Sorry! Could not find the requested channel category."
		);
	return category;
};

export const getChannelsInCategory = async (
	guild: Guild,
	categoryName: string,
	channelsFilter?: string[]
): Promise<Collection<string, NonThreadGuildBasedChannel>> => {
	await guild.channels.fetch();
	const category = getCategory(categoryName, guild);

	const channels = guild.channels.cache.filter(
		(channel) =>
			channel?.parentId === category.id &&
			// Check channels to join if specified
			(channelsFilter
				? !channelsFilter.some((name) => channel.name.includes(name))
				: true)
	);

	return channels;
};
