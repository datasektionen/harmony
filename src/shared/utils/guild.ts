import { Guild, GuildMember, User } from "discord.js";
import { harmonyClient } from "../../index";

export async function getGuild(): Promise<Guild> {
	return await harmonyClient.guilds.fetch(
		process.env.DISCORD_GUILD_ID as string
	);
}

export async function getGuildMember(
	user: User,
	guild: Guild
): Promise<GuildMember> {
	return await guild.members.fetch(user);
}
