import { User } from "discord.js";
import { getGuild, getGuildMember } from "./guild";
import { getHodisUser } from "./hodis";

export async function hasRole(user: User, roleName: string): Promise<boolean> {
	const guildMember = await getGuildMember(user);
	return !!guildMember.roles.cache.find((role) => role.name === roleName);
}

/**
 * Attempts to resolve the specified User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, checks if they possess the Verified role or not.
 */
export async function hasRoleVerified(user: User): Promise<boolean> {
	return await hasRole(user, process.env.DISCORD_VERIFIED_ROLE as string);
}

export async function setRole(user: User, roleName: string): Promise<void> {
	const guild = await getGuild();
	const role = guild.roles.cache.find((r) => r.name === roleName);
	if (!role) {
		throw new Error(`Role ${roleName} does not exist on the Server!`);
	}
	try {
		const guildMember = await getGuildMember(user);
		guildMember.roles.add(role);
	} catch (err) {
		console.log(err);
	}
}

/**
 * Attempts to resolve the provided User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, assigns them the Verified role.
 */
export async function setRoleVerified(user: User): Promise<void> {
	await setRole(user, process.env.DISCORD_VERIFIED_ROLE as string);
}

export async function setN0llanRole(user: User, kthId: string) {
	const hodisUser = await getHodisUser(kthId);
	if (hodisUser.tag.split(",").includes("D22")) {
		await setRole(user, "n0llan");
	}
}
