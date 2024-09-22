import { Guild, User } from "discord.js";
import { AliasName } from "../alias-mappings";

export async function hasRole(
	user: User,
	roleName: string,
	guild: Guild
): Promise<boolean> {
	const guildMember = await guild.members.fetch(user);
	return !!guildMember.roles.cache.find((role) => role.name === roleName);
}

/**
 * Attempts to resolve the specified User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, checks if they possess the @verified role or not.
 */
export async function hasRoleVerified(
	user: User,
	guild: Guild
): Promise<boolean> {
	return await hasRole(
		user,
		process.env.DISCORD_VERIFIED_ROLE as string,
		guild
	);
}

/**
 * Attempts to resolve the specified User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, checks if they possess the @nØllan role or not.
 */
export async function hasRoleN0llan(
	user: User,
	guild: Guild
): Promise<boolean> {
	return await hasRole(user, "nØllan", guild);
}

export async function setRole(
	user: User,
	roleName: string,
	guild: Guild
): Promise<void> {
	const role = guild.roles.cache.find((r) => r.name === roleName);
	if (!role) {
		throw new Error(`Role ${roleName} does not exist on the Server!`);
	}
	const guildMember = await guild.members.fetch(user);
	await guildMember.roles.add(role);
}

/**
 * Removes a role from a user in a guild.
 * @param user - The user to remove the role from.
 * @param roleName - The name of the role to be removed.
 * @param guild - The guild where the role exists.
 * @throws Error if the role does not exist on the server.
 */
export async function removeRole(
	user: User,
	roleName: string,
	guild: Guild
): Promise<void> {
	const role = guild.roles.cache.find((r) => r.name === roleName);
	if (!role) {
		throw new Error(`Role ${roleName} does not exist on the Server!`);
	}
	const guildMember = await guild.members.fetch(user);
	await guildMember.roles.remove(role);
}

/**
 * Attempts to resolve the provided User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, assigns them the Verified role.
 */
export async function setRoleVerified(user: User, guild: Guild): Promise<void> {
	await setRole(user, process.env.DISCORD_VERIFIED_ROLE as string, guild);
}

// Should spell with "o" instead of "0"
export async function setN0llanRole(user: User, guild: Guild): Promise<void> {
	await setRole(user, "nØllan", guild);
}

export async function setYearRoles(
	user: User,
	yearTagWithDash: string,
	guild: Guild
): Promise<void> {
	await setRole(user, yearTagWithDash, guild);
	await setRole(user, "Datasektionen", guild);
}

export async function setIntisRoles(user: User, guild: Guild): Promise<void> {
	await setRole(user, "D-intis", guild);
	await setRole(user, "Datasektionen", guild);
}

export async function setExternRole(user: User, guild: Guild): Promise<void> {
	await setRole(user, "Extern", guild);
}

export async function setPingRoles(user: User, guild: Guild): Promise<void> {
	const pingRoles = ["StudyInfo", "ChapterInfo", "SponsoredInfo"];
	await Promise.all(pingRoles.map((role) => setRole(user, role, guild)));
}

export async function toggleYearCoursesRole(
	user: User,
	guild: Guild,
	alias: AliasName
): Promise<void> {
	const yearRoles = ["Åk 1", "Åk 2", "Åk 3"];
	let selectedRole;
	switch (alias) {
		case AliasName.YEAR1:
			selectedRole = yearRoles[0];
			break;
		case AliasName.YEAR2:
			selectedRole = yearRoles[1];
			break;
		case AliasName.YEAR3:
			selectedRole = yearRoles[2];
			break;
		default:
			selectedRole = undefined;
			break;
	}
	if (!selectedRole)
		// Wrong alias supplied
		return;

	if (await hasRole(user, selectedRole, guild))
		await removeRole(user, selectedRole, guild);
	else await setRole(user, selectedRole, guild);
}

/**
 * Retrieves the roles of a user in a guild.
 * @param user The user for whom to retrieve the roles.
 * @param guild The guild in which to retrieve the roles.
 * @returns A promise that resolves to an array of role names.
 */
export async function getRoles(user: User, guild: Guild): Promise<string[]> {
	const guildMember = await guild.members.fetch(user);
	return guildMember.roles.cache.map((role) => role.name);
}

export async function hasAnyYearRole(
	user: User,
	guild: Guild
): Promise<boolean> {
	const member = await guild.members.fetch(user.id);
	return (
		!!member &&
		member.roles.cache.some((role) =>
			new RegExp("^D-[0-9]{2}$").test(role.name)
		)
	);
}
