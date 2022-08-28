export const isKthEmail = (messageText: string): boolean =>
	new RegExp(/^[a-zA-Z0-9]+@kth[.]se$/).test(messageText);

export const messageIsToken = (messageText: string): RegExpMatchArray | null =>
	messageText.match(/^[a-zA-Z0-9_-]+$/);
