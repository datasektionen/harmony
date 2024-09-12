import { Collection, Guild } from "discord.js";
import { AliasName, mappings } from "../alias-mappings";
import {
	CourseChannel,
	getAllCourseChannels,
	getCourseChannelsByNameCached,
} from "./channel-utils";

export const aliasExists = (alias: AliasName): boolean => {
	return mappings[alias] !== undefined;
};

export const getAliasChannels = async (
	guild: Guild,
	alias: AliasName
): Promise<Collection<string, CourseChannel>> => {
	// Logic for electives alias
	if (alias === AliasName.ALL_ELECTIVES) {
		const cs_master = await getAliasChannels(guild, AliasName.CS_MASTER);
		const ml_master = await getAliasChannels(guild, AliasName.ML_MASTER);

		const elective_channels = (await getAllCourseChannels(guild)).filter(
			(channel) =>
				// Exclude mandatory master courses
				!cs_master.some((cs_channel) => cs_channel === channel) &&
				!ml_master.some((ml_channel) => ml_channel === channel) &&
				// Include only channels under categories with elective courses
				channel.parent && // Not null
				channel.parent.name.toLowerCase().includes("courses")
		);
		return elective_channels;
	}

	const channelNames = mappings[alias];

	const channelNamesSet = new Set(
		channelNames.map((current) => current.toLowerCase())
	);

	return await getCourseChannelsByNameCached(guild, channelNamesSet);
};
