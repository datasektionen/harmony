import { discordClient } from ".";
import base64url from "base64url";
import { randomBytes } from "crypto";

/**
 * Attempts to resolve the specified User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, checks if they possess the Verified role or not.
 *
 * @param {Discord.UserResolvable} user The Discord User to check.
 * @returns {Boolean} if the {GuildMember} has the Verified role or not.
 */
export const hasRoleVerified = async (client, user) => {
  return await client.guilds
    .fetch(process.env.DISCORD_GUILD_ID)
    .then((guild) => {
      return guild.members.fetch(user);
    })
    .then((member) => {
      return member.roles.cache.find((role) => role.name === process.env.DISCORD_VERIFIED_ROLE)
        ? true
        : false;
    });
};

/**
 * Attempts to resolve the provided User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, assigns them the Verified role.
 *
 * @param {Discord.UserResolvable} user The Discord User to verify.
 * @returns {void}
 */
export const setRoleVerified = async (user) => {
  const guild = await discordClient.guilds.fetch(process.env.DISCORD_GUILD_ID);
  const role = guild.roles.cache.find((r) => r.name === process.env.DISCORD_VERIFIED_ROLE);
  if (!role) {
    new Error(`Role ${process.env.DISCORD_VERIFIED_ROLE} does not exist on the Server!`);
  }
  guild.members
    .fetch(user)
    .then((u) => u.roles.add(role))
    .catch((err) => console.error(err));
};

/**
 * Generates a cryptographically secure random, Base64URL-encoded string to be
 * used as a verification token.
 *
 * @param {Integer} size The number of bytes to be generated.
 * @returns {String} the Base64URL-encoded token.
 */
export const generateToken = (size) => {
  return base64url(randomBytes(size));
};

/**
 * Goes through all dotenv vars and checks if they are defined.
 * If not, the service will throw and error
 */
export const validateEnvironment = () => {
  if (
    !process.env.DATABASE_URL ||
    !process.env.SPAM_URL ||
    !process.env.SPAM_API_TOKEN ||
    !process.env.DISCORD_TOKEN ||
    !process.env.DISCORD_WELCOME_CHANNEL_ID ||
    !process.env.DISCORD_GUILD_ID
  ) {
    if (!process.env.NODE_ENV === "development") throw new Error("Missing proper configuration!");
  }
};
