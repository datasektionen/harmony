import {
	ChannelType,
	Collection,
	Guild,
	NonThreadGuildBasedChannel,
	User,
} from "discord.js";

const channelNamesToJoin = [
	"allmänt",
	"announcements",
	"portalen",
	"citat",
	"röst",
];

export const joinCategoryChannels = async (
	searchCategory: string,
	guild: Guild,
	user: User
): Promise<void> => {
	const channels = await getChannelsToJoinInCategory(guild, searchCategory);

	channels.forEach(async (channel) => {
		await channel?.permissionOverwrites.create(user, {
			ViewChannel: true,
		});
	});

	return;
};

export const leaveCategoryChannels = async (
	searchCategory: string,
	guild: Guild,
	user: User
): Promise<void> => {
	const channels = await getChannelsToJoinInCategory(guild, searchCategory);

	channels.forEach(async (channel) => {
		await channel?.permissionOverwrites.create(user, {
			ViewChannel: false,
		});
	});

	return;
};

const getChannelsToJoinInCategory = async (
	guild: Guild,
	name: string
): Promise<Collection<string, NonThreadGuildBasedChannel | null>> => {
	const allGuildChannels = await guild.channels.fetch();
	if (!allGuildChannels) throw new Error("No channels found");

	const category = allGuildChannels
		.filter(
			(channel) =>
				channel?.type === ChannelType.GuildCategory &&
				channel?.name.includes(communityCategoryHeader(name))
		)
		.first();
	if (!category) throw new Error("Category not found");

	const channels = allGuildChannels.filter(
		(channel) =>
			channel?.parentId === category.id &&
			channelNamesToJoin.some((name) => channel.name.includes(name))
	);

	return channels;
};

const communityCategoryHeader = (messageText: string): string => {
	const nums = messageText.match(/[0-9]+/g);
	return "╣ D-" + nums + " ╠";
};
