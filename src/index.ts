import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { handleCommands } from "./commands/handle-commands";
import { registerCommands } from "./commands/register-commands";

/**p
 * Goes through all dotenv vars and checks if they are defined.
 * If not, the service will throw and error
 */
function validateEnvironment(): void {
	if (
		!process.env.SPAM_URL ||
		!process.env.SPAM_API_TOKEN ||
		!process.env.DISCORD_TOKEN
	) {
		throw new Error("Missing proper configuration!");
	}
	if (
		process.env.NODE_ENV !== "production" &&
		process.env.NODE_ENV !== "development"
	) {
		throw new Error("Env has to be 'production or 'development'!");
	}
	if (
		process.env.NODE_ENV === "production" &&
		!process.env.DISCORD_LIGHT_BOT_TOKEN
	) {
		throw new Error(
			"You need a token for the light (verification) bot in prod in your env file!"
		);
	}
	if (process.env.NODE_ENV === "development" && !process.env.DISCORD_GUILD_ID) {
		throw new Error(
			"You need a token for the light (verification) bot in prod in your env file!"
		);
	}
}

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.DirectMessageTyping,
];

export const harmonyClient = new DiscordClient({
	intents,
});

export const harmonyLightClient = new DiscordClient({
	intents,
});

export type Env = "development" | "production";

async function main(): Promise<void> {
	const env = process.env.NODE_ENV as Env;
	validateEnvironment();

	harmonyClient.once("ready", () => console.log("Starting..."));
	await harmonyClient.login(process.env.DISCORD_TOKEN);
	if (env === "production") {
		await harmonyLightClient.login(process.env.DISCORD_LIGHT_BOT_TOKEN);
	}
	console.log("Logged in");
	handleCommands(env);
	registerCommands(env);
}
main();
