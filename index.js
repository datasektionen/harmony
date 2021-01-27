const Discord = require("discord.js");
const Keyv = require("keyv");
const crypto = require("crypto");
const base64url = require("base64url");
const fetch = require("node-fetch");

const DEBUG = process.env.DEBUG ? true : false;

// TODO: Importing config and checking that everything is valid can surely be done better than this...
const DB_URL = process.env.DATABASE_URL;
const SPAM_URL = process.env.SPAM_URL;
const SPAM_API_TOKEN = process.env.SPAM_API_TOKEN;

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const WELCOME_CHANNEL_ID = process.env.DISCORD_WELCOME_CHANNEL_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!DB_URL || !SPAM_URL || !SPAM_API_TOKEN || !DISCORD_TOKEN || !WELCOME_CHANNEL_ID || !GUILD_ID) {
	if (!DEBUG) throw new Error("Missing proper configuration!");
}

const VERIFIED_ROLE = process.env.DISCORD_VERIFIED_ROLE ? process.env.DISCORD_VERIFIED_ROLE : "Verified";
const MESSAGE_PREFIX = "Hej och välkommen till en av Konglig Datasektionens Discordservrar! ";

/**
 * The time-to-live for generated tokens in milliseconds.
 *
 * Defaults to 10 minutes.
 */
const TOKEN_TIMEOUT = process.env.TOKEN_TIMEOUT ? process.env.TOKEN_TIMEOUT : 10 * 60 * 1000;

/**
 * The size of generated tokens in number of bytes. Be aware that this is not necessarily
 * the final length of the Token string, but the number of random bytes generated.
 *
 * Defaults to 8 bytes (64 bits), which, together with the default token TTL of 10
 * minutes, is secure enough.
 */
const TOKEN_SIZE = process.env.TOKEN_SIZE ? process.env.TOKEN_SIZE : 8;

const client = new Discord.Client();

// TODO: We probably do not need 3 key-value stores for this if we used some class for this.
const token_email = new Keyv(DB_URL, { namespace: "token_email" });
const token_discord = new Keyv(DB_URL, { namespace: "token_discord" });
const verified_users = new Keyv(DB_URL, { namespace: "verified_users" });

token_discord.clear();
token_email.clear();

client.once("ready", () => console.log("Starting..."));
client.login(DISCORD_TOKEN).then(console.log("Logged in!"));

/**
 * Listens to  message events emitted to the Client, and responds according to 
 * context.
 *
 * Generally, there are 4 cases that we handle here:
 * - A user sends a message in the specified Welcome Channel
 * - A user sends the !verify command in the specified Welcome Channel
 * - A user sends the Bot a DM with a KTH address
 * - A user sends the Bot a DM with a Token-like string
 * Any other case is disregarded.
 *
 * TODO: Should probably break this up into smaller functions, and I am not
 * 		100% certain on how correct the async behavior is...
 */
client.on("message", async msg => {
	if (msg.author.bot) {
		return;
	}
	if (hasRoleVerified(msg.author)) {
		return;
	}
	const text = msg.content.trim();
	if (msg.channel.id === WELCOME_CHANNEL_ID) {
		if (text === "!verify") {
			msg.author.createDM()
				.then(channel => {
					channel.send("Svara med din KTH-mejladress för att få en registreringskod!");
				})
				.catch(err => console.error(err));
		} else {
			msg.channel
				.send(MESSAGE_PREFIX + "Använd kommandot '!verify' för att påbörja verifikationsprocessen och få tillgång till övriga kanaler!")
				.catch(err => console.error(err));
		}
	} else if (msg.channel.type === "dm") {
		if (new RegExp(/^.*@kth.se$/).test(text)) {
			const token = generateToken(TOKEN_SIZE);
			token_discord.set(token, msg.author.id, TOKEN_TIMEOUT);
			token_email.set(token, text, TOKEN_TIMEOUT);
			// TODO: Abstract away email dispatch, maybe write a better template.
			fetch(`${SPAM_URL}/api/sendmail`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					from: "no-reply@datasektionen.se",
					to: text,
					subject: "Discord Verifikation",
					html: `<p>Verifikationskod: ${token}</p>`,
					key: SPAM_API_TOKEN,
				}),
			})
				.then(res => console.log(`Email sent, received response: ${JSON.stringify(res)}`))
				.then(msg.channel
					.send("Verifikationskod skickad. Kolla dina mejl!")
					.catch(err => console.error(err)));
		} else if (text.match(/^[a-zA-Z0-9_-]+$/)) {
			Promise.all([token_email.get(text), token_discord.get(text)])
				.then(([email_address, discord_id]) => {
					if (email_address && discord_id && discord_id === msg.author.id) {
						verified_users.set(discord_id, email_address);
						setRoleVerified(msg.author)
							.then(
								msg.channel
									.send(`Du är nu verifierad. Dubbelkolla att du har blivit tilldelad ${VERIFIED_ROLE} rollen!`)
									.catch(err => console.error(err)));
					} else {
						msg.channel
							.send("Felaktig kod.")
							.catch(err => console.error(err));
					}
				})
				.catch(err => console.error(err));
		} else {
			msg.channel
				.send("Något har blivit fel. Du ska antingen svara med en @kth.se adress, eller en giltig kod.")
				.catch(err => console.error(err));
		}
	}
});

/**
 * Attempts to resolve the specified User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, checks if they possess the Verified role or not.
 *
 * @param {Discord.UserResolvable} user The Discord User to check.
 * @returns {Boolean} if the {GuildMember} has the Verified role or not.
 */
const hasRoleVerified = async (user) => {
	return await client.guilds.fetch(GUILD_ID)
		.then(guild => {
			return guild.members.fetch(user);
		})
		.then(member => {
			return member.roles.cache.find(role => role.name === VERIFIED_ROLE) ? true : false;
		});
};

/**
 * Attempts to resolve the provided User-like data to a {Discord.GuildMember} on the server,
 * and, if successful, assigns them the Verified role.
 *
 * @param {Discord.UserResolvable} user The Discord User to verify.
 * @returns {void}
 */
const setRoleVerified = async (user) => {
	const guild = await client.guilds.fetch(GUILD_ID);
	const role = guild.roles.cache.find(r => r.name === VERIFIED_ROLE);
	if (!role) {
		new Error(`Role ${VERIFIED_ROLE} does not exist on the Server!`);
	}
	guild.members.fetch(user)
		.then(u => u.roles.add(role))
		.catch(err => console.error(err));
};

/**
 * Generates a cryptographically secure random, Base64URL-encoded string to be
 * used as a verification token.
 *
 * @param {Integer} size The number of bytes to be generated.
 * @returns {String} the Base64URL-encoded token.
 */
const generateToken = (size) => {
	return base64url(crypto.randomBytes(size));
};