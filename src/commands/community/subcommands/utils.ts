export const isCommunity = (messageText: string): RegExpMatchArray | null =>
	messageText.match(/^D?-?[0-9]{2}$/);

export const joinableCommunityChannels = [
	"︲allmänt",
	"︲announcements",
	"︲portalen",
	"︲citat",
	"︲röst",
];

export const communityCategoryHeader = (messageText: string): string => {
	const nums = messageText.match(/[0-9]+/g);
	return "╣ D-" + nums + " ╠";
};
