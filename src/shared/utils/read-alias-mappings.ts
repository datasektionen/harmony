import { Collection, Guild } from "discord.js";
import { AliasName, mappings } from "../alias-mappings";
import { CourseChannel, getAllCourseChannels, getCourseChannelsByNameCached } from "./channel-utils";

export const aliasExists = (alias: AliasName): boolean => {
	return mappings[alias] !== undefined;
};

export const getAliasChannels = async (guild: Guild, alias: AliasName): Promise<Collection<string, CourseChannel>> => {
	// Logic for electives alias
	if (alias === AliasName.ALL_ELECTIVES) {
		const mandatories = await getAliasChannels(guild, AliasName.ALL_MANDATORY);

		const elective_categories = ["elective courses", "master courses"];

		const elective_channels = (await getAllCourseChannels(guild))
			.difference(mandatories)
			.filter(channel => 
				elective_categories.some(category => 
					channel.parent && // Not null
					channel.parent.name.toLowerCase().includes(category)
				)
			);
		return elective_channels;
	}

	const channelNames = mappings[alias];

	const channelNamesSet = new Set(channelNames.map((current) => current.toLowerCase()));

	return await getCourseChannelsByNameCached(guild, channelNamesSet);
};
