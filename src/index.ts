import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { LightClient as LightDiscordClient } from "./shared/types/light-client";
import { handleCommands } from "./commands/handle-commands";
import { registerCommands } from "./commands/register-commands";

/**p
 * Goes through all dotenv vars and checks if they are defined.
 * If not, the service will throw an error
 */
function validateEnvironment(): void {
	if (
		!process.env.SPAM_URL ||
		!process.env.SPAM_API_TOKEN ||
		(!process.env.DISCORD_BOT_TOKEN && !process.env.DISCORD_LIGHT_BOT_TOKEN)
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

export type Env = "development" | "production";

async function main(): Promise<void> {
	const env = process.env.NODE_ENV as Env;
	validateEnvironment();

	if (process.env.DISCORD_BOT_TOKEN) {
		harmonyClient.once("ready", () => console.log("Logged into Harmony"));
		await harmonyClient.login(process.env.DISCORD_BOT_TOKEN);
	}
	if (process.env.DISCORD_LIGHT_BOT_TOKEN) {
		harmonyLightClient.once("ready", () => console.log("Logged into Harmony Light"));
		await harmonyLightClient.login(process.env.DISCORD_LIGHT_BOT_TOKEN);
	}
	handleCommands(env);
	await registerCommands(env);
}
main();
