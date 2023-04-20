import { Guild, User } from "discord.js";
import { getGuildMember } from "./guild";
import { getHodisUser } from "./hodis";
import { NollegruppRoles } from "../assets/mottagning/nolle_codes";
import { verifyNolleCode } from "./verify_nolle_code";

export async function hasRole(
	user: User,
	roleName: string,
	guild: Guild
): Promise<boolean> {
	const guildMember = await getGuildMember(user, guild);
	return !!guildMember.roles.cache.find((role) => role.name === roleName);
}

/**
 * Attempts to resolve the specified User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, checks if they possess the Verified role or not.
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

export async function setRole(
	user: User,
	roleName: string,
	guild: Guild
): Promise<void> {
	const role = guild.roles.cache.find((r) => r.name === roleName);
	if (!role) {
		throw new Error(`Role ${roleName} does not exist on the Server!`);
	}
	const guildMember = await getGuildMember(user, guild);
	await guildMember.roles.add(role);
}

/**
 * Attempts to resolve the provided User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, assigns them the Verified role.
 */
export async function setRoleVerified(user: User, guild: Guild): Promise<void> {
	await setRole(user, process.env.DISCORD_VERIFIED_ROLE as string, guild);
}

// Should spell with "o" instead of "0"
export async function setN0llanRole(
	user: User,
	kthId: string,
	guild: Guild
): Promise<void> {
	const hodisUser = await getHodisUser(kthId);
	if (hodisUser.tag.split(",").includes("D22")) {
		await setRole(user, "n0llan", guild);
	}
}

export async function extractYearFromUser(kthEmail: string): Promise<{
	yearRole: string | null;
	year: number | null;
}> {
	const hodisUser = await getHodisUser(kthEmail.split("@")[0]);
	const yearTag = hodisUser.tag
		.split(",")
		.find((tag) => tag.match(/^D\d{2}$/i));
	if (yearTag) {
		const yearTagWithDash = `${yearTag
			.slice(0, 1)
			.toUpperCase()}-${yearTag.slice(1)}`;
		return { yearRole: yearTagWithDash, year: parseInt(yearTag.slice(1)) };
	}

	return { year: null, yearRole: null };
}

export async function setYearRoles(
	user: User,
	yearTagWithDash: string,
	guild: Guild
): Promise<void> {
	await setRole(user, yearTagWithDash, guild);
	await setRole(user, "Datasektionen", guild);
}

export async function setExternRole(user: User, guild: Guild): Promise<void> {
	await setRole(user, "Extern", guild);
}

export async function setPingRoles(user: User, guild: Guild): Promise<void> {
	const pingRoles = ["StudyInfo", "ChapterInfo", "SponsoredInfo"];
	await Promise.all(pingRoles.map((role) => setRole(user, role, guild)));
}

export async function setNollegruppRoles(user: User, code: string, guild: Guild): Promise<void> {
	const validNollegruppRoleNames = verifyNolleCode(code);
	if (!validNollegruppRoleNames)
		throw new Error("Invalid code!")

	try {
		await setRole(user, validNollegruppRoleNames[0], guild); // Real group name
	} catch {
		await setRole(user, validNollegruppRoleNames[1], guild); // "Grupp X"
	}
}