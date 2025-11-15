import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { LightClient as LightDiscordClient } from "./shared/types/light-client";
import { handleInteractions } from "./commands/handle-commands";
import { registerCommands } from "./commands/register-commands";
import * as db from "./db/db";
import { userJoined } from "./shared/utils/userJoined";
import { initJobs } from "./jobs/jobs";
import { CronJob } from "cron";
import * as log from "./shared/utils/log";
import { handle_abood_mention } from "./shared/utils/abood";

/**p
 * Goes through all dotenv vars and checks if they are defined.
 * If not, the service will throw an error
 */
function validateEnvironment(): void {
	if (
		!process.env.DISCORD_BOT_TOKEN &&
		!process.env.DISCORD_LIGHT_BOT_TOKEN
	) {
		throw new Error(
			"DISCORD_BOT_TOKEN or DISCORD_LIGHT_BOT_TOKEN needs to be set"
		);
	}

	if (!process.env.SPAM_API_TOKEN)
		console.error("SPAM_API_TOKEN not set. Sending emails disabled.");
	if (!process.env.DEEPL_API_KEY)
		console.error("DEEPL_API_KEY not set. Translations disabled.");
}

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.DirectMessageTyping,
];

export const harmonyClient = new DiscordClient({ intents });

export const harmonyLightClient = new LightDiscordClient({ intents });

export let jobs: Map<string, { client: DiscordClient; job: CronJob }> =
	new Map();

async function main(): Promise<void> {
	validateEnvironment();
	await db.init();
	log.info("Initialized database");
	if (process.env.DISCORD_BOT_TOKEN) {
		harmonyClient.once("ready", () => {
			log.info("Logged into Harmony");
			jobs = initJobs(harmonyClient);
			log.info("Instantiated cron-jobs.");
		});
		await harmonyClient.login(process.env.DISCORD_BOT_TOKEN);

		harmonyClient.on("guildMemberAdd", (member) =>
			userJoined(member, false)
		);
		harmonyClient.on("interactionCreate", async (interaction) => {
			await handleInteractions(interaction);
		});
		harmonyClient.on("messageCreate", async (message) => {
			// Ensure that message is not via DM, and that it contains @abood.
			if (
				message.guild &&
				message.member &&
				message.mentions.roles.find((role) => role.name === "abood")
			) {
				await handle_abood_mention(
					message,
					message.member.user,
					message.guild
				);
			}
		});
	}
	if (process.env.DISCORD_LIGHT_BOT_TOKEN) {
		harmonyLightClient.once("ready", () => {
			log.info("Logged into Harmony Light");
		});
		await harmonyLightClient.login(process.env.DISCORD_LIGHT_BOT_TOKEN);

		harmonyLightClient.on("guildMemberAdd", (member) =>
			userJoined(member, true)
		);
		harmonyLightClient.on("interactionCreate", async (interaction) => {
			await handleInteractions(interaction);
		});
	}
	await registerCommands();
}

main().catch(log.error);
