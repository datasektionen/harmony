import { Collection, Guild } from "discord.js";
import { AliasName, mappings } from "../alias-mappings";
import { CourseChannel, getAllCourseChannels, getCourseChannelsByNameCached } from "./channel-utils";

export const aliasExists = (alias: AliasName): boolean => {
	return mappings[alias] !== undefined;
};

export const getAliasChannels = async (guild: Guild, alias: AliasName): Promise<Collection<string, CourseChannel>> => {
	let channelNames = mappings[alias];

	if (alias === AliasName.ALL) {
		channelNames = (await getAllCourseChannels(guild))
			.map((channel) => channel.name);
	}

	const channelNamesSet = new Set(channelNames.map((current) => current.toLowerCase()));

	return await getCourseChannelsByNameCached(guild, channelNamesSet);
};
