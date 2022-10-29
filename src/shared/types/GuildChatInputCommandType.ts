import type { ChatInputCommandInteraction, Guild } from "discord.js";

export type GuildChatInputCommandInteraction = Omit<
	ChatInputCommandInteraction,
	"guild"
> & { guild: Guild };
