import {
	Collection,
	ForumChannel,
	GuildBasedChannel,
	Snowflake,
	TextChannel,
	Guild,
	PermissionFlagsBits,
	User,
} from "discord.js";
import { AliasName, mappings } from "../alias-mappings";
import { GuildButtonOrCommandInteraction } from "../types/GuildButtonOrCommandInteraction";
import { getAliasChannels } from "./read-alias-mappings";
import { validCourseCode } from "./valid-course-code";
import { toggleYearCoursesRole } from "./roles";
import { joinChannel } from "../../commands/join/join.handler";

export type CourseChannel = ForumChannel | TextChannel;

export const isCourseChannel = (channel?: GuildBasedChannel): boolean => {
	return (
		channel !== undefined &&
		(channel instanceof TextChannel || channel instanceof ForumChannel)
	);
};

export const handleChannelAlias = async (
	guild: Guild,
	user: User,
	alias: string,
	actionCallback: (channel: CourseChannel, user: User) => Promise<void>
): Promise<number> => {
	if (
		[AliasName.YEAR1, AliasName.YEAR2, AliasName.YEAR3].includes(
			alias as AliasName
		)
	) {
		toggleYearCoursesRole(user, guild, alias as AliasName);
		return mappings[alias as AliasName].length;
	}

	const channels = await getAliasChannels(guild, alias as AliasName);
	if (channels.size === 0) {
		return 0;
	}

	const couldViewChannel = new Collection<CourseChannel, boolean>();
	for (const channel of channels.values()) {
		couldViewChannel.set(channel, userCanViewChannel(user.id, channel));
	}

	const promises = channels.map((channel) =>
		actionCallback(channel as CourseChannel, user)
	);
	await Promise.allSettled(promises);

	let updateCount = 0;
	for (let channel of channels.values()) {
		channel = await channel.fetch();
		const oldPermission = couldViewChannel.get(channel);
		const newPermission = userCanViewChannel(user.id, channel);
		if (oldPermission != newPermission) {
			updateCount += 1;
		}
	}
	return updateCount;
};

export const handleChannel = async (
	courseCode: string,
	interaction: GuildButtonOrCommandInteraction,
	actionCallback: (
		channel: ForumChannel | TextChannel,
		user: User
	) => Promise<void>,
	noInteraction?: boolean,
	skipCheckingCourseCode?: boolean
): Promise<void> => {
	noInteraction = noInteraction ?? false;
	if (!noInteraction) {
		await interaction.deferReply({ ephemeral: true });
	}

	await interaction.guild.channels.fetch();
	const channel = interaction.guild.channels.cache.find(({ name }) =>
		name.startsWith(courseCode + "-")
	);

	// If no course was found, return with a message.
	// If we skip checking the course code (e.g. in verify-nollan) continue the function
	// If the course code was invalid, return with a message.
	if (
		channel == undefined ||
		(!skipCheckingCourseCode && !validCourseCode(channel.name))
	) {
		if (!noInteraction) {
			await interaction.editReply({
				content: "The course code is not valid",
			});
		}
		return;
	}

	if (!isCourseChannel(channel)) {
		if (!noInteraction) {
			await interaction.editReply({
				content:
					"Channel not found, please contact a mod if you think this is a mistake",
			});
		}
		return;
	}

	await actionCallback(channel as CourseChannel, interaction.user);

	if (!noInteraction) {
		if (actionCallback === joinChannel) {
			await interaction.editReply({
				content: `Successfully updated visibility for ${channel}`,
			});
		} else {
			await interaction.editReply({
				content: `Successfully updated visibility for \`#${(channel as CourseChannel).name
					}\``,
			});
		}
	}
	return;
};

const cachesByGuildId = new Collection<
	Snowflake,
	Collection<string, Snowflake>
>();

async function courseCodeToChannelIdCache(
	guild: Guild,
	names: Set<string>
): Promise<Collection<string, Snowflake>> {
	const nameArray = Array.from(names);
	let cache = cachesByGuildId.get(guild.id);
	if (!cache) {
		cache = new Collection<string, Snowflake>();
		cachesByGuildId.set(guild.id, cache);
	}
	if (!cache.hasAll(...nameArray)) {
		const idsAndChannels = await getCourseChannelsByName(guild, names);
		for (const [id, channel] of idsAndChannels) {
			const courseCode = channelNameToCourseCode(channel.name);
			cache?.set(courseCode, id);
		}
	}
	return cache;
}

function channelNameToCourseCode(channelName: string): string {
	return channelName.split("-")[0];
}

export async function getCourseChannelsByNameCached(
	guild: Guild,
	names: Set<string>
): Promise<Collection<string, CourseChannel>> {
	const courseCodeChannelCache = await courseCodeToChannelIdCache(
		guild,
		names
	);
	const courseChannels = new Collection<string, CourseChannel>();
	for (const name of names) {
		const channelId = courseCodeChannelCache.get(name);
		if (channelId) {
			const channel = guild.channels.cache.get(
				channelId
			) as CourseChannel;
			courseChannels.set(channelId, channel);
		}
	}
	return courseChannels;
}

export async function getCourseChannelsByName(
	guild: Guild,
	names: Set<string>
): Promise<Collection<string, CourseChannel>> {
	await guild.channels.fetch();
	const channels = guild.channels.cache
		.filter((current) => names.has(channelNameToCourseCode(current.name)))
		.filter(isCourseChannel)
		.mapValues((channel) => channel as CourseChannel);
	return channels;
}

function userCanViewChannel(
	userId: Snowflake,
	channel: CourseChannel
): boolean {
	return (
		channel.permissionsFor(userId)?.has(PermissionFlagsBits.ViewChannel) ??
		false
	);
}

export async function isMemberOfAlias(
	guild: Guild,
	userId: Snowflake,
	alias: AliasName
): Promise<boolean> {
	const aliasChannels = await getAliasChannels(guild, alias);
	return !aliasChannels.some(
		(channel) => !userCanViewChannel(userId, channel)
	);
}

export async function getAllCourseChannels(
	guild: Guild
): Promise<Collection<string, CourseChannel>> {
	await guild.channels.fetch();
	const courseChannels = guild.channels.cache
		.filter(isCourseChannel)
		.filter((channel) => validCourseCode(channel.name))
		.mapValues((channel) => channel as CourseChannel);
	return courseChannels;
}

export const sleep = (ms: number): Promise<NodeJS.Timeout> =>
	new Promise((r) => setTimeout(r, ms));
