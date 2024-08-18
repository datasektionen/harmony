export const isCommunity = (messageText: string): RegExpMatchArray | null =>
	// Matches e.g. 2020, D2020, D-2020, 20, D20, and D-20
	messageText.match(/^[Dd]?-?([0-9]{2})?[0-9]{2}$/);

// Try joining channels under the community category with these names only
// Note: these are the ends of channel names without the emoji prefix.
//       Emoji prefixes might differ from community to community.
export const joinableCommunityChannels = [
	"allmänt",
	"announcements",
	"portalen",
	"random",
	"citat",
	"röst",
];

export const communityCategoryHeader = (messageText: string): string => {
	const year = communityYear(messageText);
	const headerFormat = process.env.COMMUNITY_HEADER_FORMAT ?? "D-XX";
	return headerFormat.replace("XX", `${year}`);
};

// Extract year from user input
// Extracts a 2-digit number representing the year
// Allow user input of the following formats:
// 2020, D2020, D-2020, 20, D20, D-20 --> 20
export const communityYear = (messageText: string): string | undefined => {
	return messageText
		.match(/[0-9]+/g)
		?.at(0)
		?.slice(-2);
};
