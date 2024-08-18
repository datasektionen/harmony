import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { LightClient as LightDiscordClient } from "./shared/types/light-client";
import { handleCommands } from "./commands/handle-commands";
import { registerCommands } from "./commands/register-commands";
import * as db from "./db/db";
import { userJoined } from "./shared/utils/userJoined";

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
	console.log("Initialized database");
	if (process.env.DISCORD_BOT_TOKEN) {
		harmonyClient.once("ready", () => console.log("Logged into Harmony"));
		await harmonyClient.login(process.env.DISCORD_BOT_TOKEN);

		harmonyClient.on("guildMemberAdd", (member) => userJoined(member));
	}
	if (process.env.DISCORD_LIGHT_BOT_TOKEN) {
		harmonyLightClient.once("ready", () =>
			console.log("Logged into Harmony Light")
		);
		await harmonyLightClient.login(process.env.DISCORD_LIGHT_BOT_TOKEN);

		harmonyLightClient.on("guildMemberAdd", (member) => userJoined(member));
	}
	handleCommands();
	await registerCommands();
}

main().catch(console.error);
