import { Message } from "discord.js";

export const isKthEmail = (messageText: string) =>
	new RegExp(/^[a-zA-Z0-9]+@kth[.]se$/).test(messageText);

export const messageIsToken = (messageText: string) =>
	messageText.match(/^[a-zA-Z0-9_-]+$/);
