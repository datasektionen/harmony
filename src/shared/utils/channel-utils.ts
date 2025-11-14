import {
	Collection,
	ForumChannel,
	GuildBasedChannel,
	Snowflake,
	TextChannel,
	Guild,
	User,
	MessageFlags,
} from "discord.js";
import { courseAliases, roleAliases } from "../alias-mappings";
import { GuildButtonOrCommandInteraction } from "../types/GuildButtonOrCommandInteraction";
import { validCourseCode } from "./valid-course-code";
import { removeRole, setRole } from "./roles";

export type CourseChannel = ForumChannel | TextChannel;

export const joinChannel = async (
	channel: CourseChannel,
	user: User
): Promise<void> => {
	await channel.permissionOverwrites.create(user, {
		ViewChannel: true,
	});
};

export const leaveChannel = async (
	channel: CourseChannel,
	user: User
): Promise<void> => {
	await channel.permissionOverwrites.delete(user);
};

export const isCourseChannel = (channel?: GuildBasedChannel): boolean => {
	return (
		channel !== undefined &&
		(channel instanceof TextChannel || channel instanceof ForumChannel)
	);
};

// Unified handling of role aliases, course aliases, and course codes.
export async function handleCourseCode(
	courseCode: string,
	interaction: GuildButtonOrCommandInteraction,
	actionCallback: (
		channel: ForumChannel | TextChannel,
		user: User
	) => Promise<void>
): Promise<void> {
	const role = roleAliases.get(courseCode);
	const newCourseCode = courseAliases.get(courseCode);

	// Role alias.
	if (roleAliases.has(courseCode) && role !== undefined) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		// slightly cursed, but it works...
		if (actionCallback === joinChannel) {
			setRole(interaction.user, role, interaction.guild);
		} else {
			removeRole(interaction.user, role, interaction.guild);
		}
		await interaction.editReply({
			content: `Successfully updated visibility for \`${courseCode}\`!`,
		});
		return;
	}
	// Course alias.
	else if (courseAliases.has(courseCode) && newCourseCode !== undefined) {
		return await handleChannel(newCourseCode, interaction, actionCallback);
	}
	// Course code.
	return await handleChannel(courseCode, interaction, actionCallback);
}

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
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	}

	await interaction.guild.channels.fetch();
	const channel = interaction.guild.channels.cache.find(({ name }) =>
		name.startsWith(courseCode + "-")
	);

	// If no course was found, return with a message.
	// If we skip checking the course code (e.g. in verify-nollan) continue the function
	// If the course code was invalid, return with a message.
	if (
		channel === undefined ||
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
				content: `Successfully updated visibility for \`#${channel.name}\``,
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
