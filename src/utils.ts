import { discordClient } from ".";
import base64url from "base64url";
import { randomBytes } from "crypto";
import { User } from "discord.js";

/**
 * Attempts to resolve the specified User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, checks if they possess the Verified role or not.
 */
export async function hasRoleVerified(user: User): Promise<boolean> {
	return await discordClient.guilds
		.fetch(process.env.DISCORD_GUILD_ID as string)
		.then((guild) => {
			return guild.members.fetch(user);
		})
		.then((member) => {
			const cache = member.roles.cache.find(
				(role) => role.name === process.env.DISCORD_VERIFIED_ROLE
			);
			if (cache) {
				return true;
			}
			return false;
		});
}

/**
 * Attempts to resolve the provided User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, assigns them the Verified role.
 */
export async function setRoleVerified(user: User): Promise<void> {
	const guild = await discordClient.guilds.fetch(
		process.env.DISCORD_GUILD_ID as string
	);
	const role = guild.roles.cache.find(
		(r) => r.name === process.env.DISCORD_VERIFIED_ROLE
	);
	if (!role) {
		throw new Error(
			`Role ${process.env.DISCORD_VERIFIED_ROLE} does not exist on the Server!`
		);
	}
	guild.members
		.fetch(user)
		.then((u) => u.roles.add(role))
		.catch((err) => console.error(err));
}

/**
 * Generates a cryptographically secure random, Base64URL-encoded string to be
 * used as a verification token.
 *
 * @param {Integer} size The number of bytes to be generated.
 * @returns {String} the Base64URL-encoded token.
 */
export function generateToken(size: number) {
	return base64url(randomBytes(size));
}

/**
 * Goes through all dotenv vars and checks if they are defined.
 * If not, the service will throw and error
 */
export function validateEnvironment() {
	if (
		!process.env.SPAM_URL ||
		!process.env.SPAM_API_TOKEN ||
		!process.env.DISCORD_TOKEN ||
		!process.env.DISCORD_WELCOME_CHANNEL_ID ||
		!process.env.DISCORD_GUILD_ID
	) {
		if (process.env.NODE_ENV === "development")
			throw new Error("Missing proper configuration!");
	}
}
