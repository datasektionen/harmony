import { Guild, GuildMember, User } from "discord.js";
import { discordClient } from "..";

export async function getGuild(): Promise<Guild> {
	return await discordClient.guilds.fetch(
		process.env.DISCORD_GUILD_ID as string,
	);
}

export async function getGuildMember(user: User): Promise<GuildMember> {
	const guild = await getGuild();
	return await guild.members.fetch(user);
}
