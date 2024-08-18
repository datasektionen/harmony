import { Guild, User } from "discord.js";
import { removeRole, setRole } from "../../../shared/utils/roles";
import { getChannelsInCategory } from "../../../shared/utils/category";

export const yearRegex = /[Dd]?-?([0-9]{2})?[0-9]{2}/;
export const masterRegex = /[A-Za-z]{2}-master/;

// Matches e.g. 2020, D2020, D-2020, 20, D20, and D-20
export const isYear = (messageText: string): boolean =>
	(new RegExp(`^${yearRegex.source}$`)).test(messageText);

// Matches e.g. 2020, D2020, D-2020, 20, D20, and D-20 with other stuff around
export const categoryIsYear = (messageText: string): RegExpMatchArray | null =>
	messageText.match(yearRegex);

// Accepts e.g. "cs" or "cs-master"
export const isMaster = (messageText: string): boolean =>
	additionalCommunities.some(name => 
		name === messageText.toLowerCase() ||
		name + "-master" === messageText.toLowerCase()
	);

// Accepts e.g. "cs" or "cs-master" with other stuff around
export const categoryIsMaster = (messageText: string): boolean =>
	additionalCommunities.some(name => 
		messageText.toLowerCase().includes(name) ||
		messageText.toLowerCase().includes(name + "-master") 
	);

// Try joining channels under the community category with these names only
// Note: these are the ends of channel names without the emoji prefix.
//       Emoji prefixes might differ from community to community.
export const unjoinableCommunityChannels = [
	"mod",
];

export const additionalCommunities = [
	"cs",
	"ml",
];

// Extract year from user input
// Extracts a 2-digit number representing the year
// Allow user input of the following formats:
// 2020, D2020, D-2020, 20, D20, D-20 --> 20
export const communityYear = (messageText: string): string | undefined => {
	return messageText.match(/[0-9]+/g)?.at(0)?.slice(-2);
};

// Converts community names accepted by isYear and isMaster to their correct category/role names
export const getCommunityCategory = (messageText: string, paramIsYear: boolean): string => {
	if (paramIsYear) {
		return "D-" + communityYear(messageText);
	} else {
		return messageText.slice(0, 2).toUpperCase() + "-master";
	}
};

export const joinLeaveCommunity = async (
	community: string,
	guild: Guild,
	user: User,
	isMasterCommunity: boolean,
	join: boolean
): Promise<void> => {
	if (isMasterCommunity) {
		// Handle master role
		if (join)
			setRole(user, community, guild);
		else
			removeRole(user, community, guild);
	} else {
		const channels = await getChannelsInCategory(guild, community, unjoinableCommunityChannels);

		channels.forEach(async (channel) => {
			await channel?.permissionOverwrites.create(user, {
				ViewChannel: join,
			});
		});
	}
};
