export const isCommunity = (messageText: string): RegExpMatchArray | null =>
	messageText.match(/^D?-?[0-9]{2}$/);
