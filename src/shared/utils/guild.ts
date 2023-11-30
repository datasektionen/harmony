import { Guild, GuildMember, User } from "discord.js";

export async function getGuildMember(
	user: User,
	guild: Guild
): Promise<GuildMember> {
	return await guild.members.fetch(user);
}
