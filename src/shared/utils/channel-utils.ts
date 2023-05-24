import { Collection, ForumChannel, GuildBasedChannel, Snowflake, TextChannel, Guild, PermissionFlagsBits, } from "discord.js";
import { AliasName } from "../alias-mappings";
import { GuildButtonOrCommandInteraction } from "../types/GuildButtonOrCommandInteraction";
import { getAliasChannels } from "./read-alias-mappings";
import { validCourseCode } from "./valid-course-code";

export type CourseChannel = ForumChannel | TextChannel;

export const isCourseChannel = (channel?: GuildBasedChannel): boolean => {
	return (
		channel !== undefined &&
		(channel instanceof TextChannel || channel instanceof ForumChannel)
	);
};

export const handleChannelAlias = async (
	alias: string,
	interaction: GuildButtonOrCommandInteraction,
	actionCallback: (
		channel: CourseChannel,
		interaction: GuildButtonOrCommandInteraction,
	) => Promise<void>,
	noInteraction?: boolean,
	updateVerbPastTense?: string 
): Promise<void> => {
	noInteraction = noInteraction ?? false;
	updateVerbPastTense = updateVerbPastTense ?? "updated";

	const channelNames = getAliasChannels(alias as AliasName);
	if (channelNames.size === 0) {
		return;
	}
	if (!noInteraction && !interaction.replied && !interaction.deferred) {
		await interaction.deferReply({
			ephemeral: true,
		});
	}

	const channels = await getCourseChannelsByNameCached(interaction.guild, channelNames);
	if (!channels) {
		return;
	}

	const promises = channels.map((channel) =>
		actionCallback(channel as CourseChannel, interaction)
	);
	await Promise.allSettled(promises);
	if (!noInteraction && !interaction.replied) {
		await interaction.editReply({
			content: `Successfully updated your visibility for \`${alias}\`! (${channels.size}) channels ${updateVerbPastTense}`,
		});
	}
	return;
};

export const handleChannel = async (
	courseCode: string,
	interaction: GuildButtonOrCommandInteraction,
	actionCallback: (
		channel: ForumChannel | TextChannel,
		interaction: GuildButtonOrCommandInteraction
	) => Promise<void>
): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });
	if (!validCourseCode(courseCode)) {
		await interaction.editReply({
			content: "The course code is not valid",
		});
		return;
	}

	await interaction.guild.channels.fetch();
	const channel = interaction.guild.channels.cache.find(({ name }) =>
		name.startsWith(courseCode)
	);

	if (!isCourseChannel(channel)) {
		await interaction.editReply({
			content:
				"Channel not found, please contact a mod if you think this is a mistake",
		});
		return;
	}

	await actionCallback(channel as CourseChannel, interaction);

	await interaction.editReply({
		content: `Successfully updated visibility for \`#${(channel as CourseChannel).name
			}\``,
	});
	return;
};

const cachesByGuildId = new Collection<Snowflake, Collection<string, Snowflake>>();

async function courseCodeToChannelIdCache(guild: Guild, names: Set<string>): Promise<Collection<string, Snowflake>> {
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
	return channelName.split("-")[0]
}

async function getCourseChannelsByNameCached(guild: Guild, names: Set<string>): Promise<Collection<string, CourseChannel>> {
	const courseCodeChannelCache = await courseCodeToChannelIdCache(guild, names); 
	const courseChannels = new Collection<string, CourseChannel>();
	for (const name of names) {
		const channelId = courseCodeChannelCache.get(name);
		if (channelId) {
			const channel = guild.channels.cache.get(channelId) as CourseChannel;
			courseChannels.set(channelId, channel)
		}
	}
	return courseChannels;
}

async function getCourseChannelsByName(guild: Guild, names: Set<string>): Promise<Collection<string, CourseChannel>> {
	await guild.channels.fetch();
	const channels = guild.channels.cache
		.filter((current) => names.has(channelNameToCourseCode(current.name)))
		.filter(isCourseChannel)
		.mapValues((channel) => channel as CourseChannel);
	return channels
}

function userCanViewChannel(userId: Snowflake, channel: CourseChannel): boolean {
	const permissions = channel.permissionsFor(userId);
	if (permissions) {
		return permissions.has(PermissionFlagsBits.ViewChannel);
	}
	return false;
}

export async function isMemberOfAlias(guild: Guild, userId: Snowflake, alias: AliasName): Promise<boolean> {
	const aliasChannelNames = getAliasChannels(alias);
	const aliasChannels = await getCourseChannelsByNameCached(guild, aliasChannelNames);
	for (const channel of aliasChannels.values()) {
		if (!userCanViewChannel(userId, channel)) {
			return false;
		}
	}
	return true;
}
