import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { LightClient as LightDiscordClient } from "./shared/types/light-client";
import { handleInteractions } from "./commands/handle-commands";
import { registerCommands } from "./commands/register-commands";
import * as db from "./db/db";
import { userJoined } from "./shared/utils/userJoined";
import * as log from "./shared/utils/log";
import { handle_abood_mention } from "./shared/utils/abood";

/**p
 * Goes through all dotenv vars and checks if they are defined.
 * If not, the service will throw an error
 */
function validateEnvironment(): void {
	if (
		!process.env.SPAM_URL ||
		!process.env.SPAM_API_TOKEN ||
		(!process.env.DISCORD_BOT_TOKEN &&
			!process.env.DISCORD_LIGHT_BOT_TOKEN) ||
		!process.env.DATABASE_URL
	) {
		throw new Error("Missing proper configuration!");
	}
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

async function main(): Promise<void> {
	validateEnvironment();

	await db.init();
	log.info("Initialized database");
	if (process.env.DISCORD_BOT_TOKEN) {
		harmonyClient.once("ready", () => log.info("Logged into Harmony"));
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
		harmonyLightClient.once("ready", () =>
			log.info("Logged into Harmony Light")
		);
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
