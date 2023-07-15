import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { LightClient as LightDiscordClient } from "./shared/types/light-client";
import { handleCommands } from "./commands/handle-commands";
import { registerCommands } from "./commands/register-commands";
import env from "./shared/env";

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

export const harmonyLightClient = new LightDiscordClient({
	intents,
});

async function main(): Promise<void> {
	harmonyClient.once("ready", () => console.log("Starting..."));
	await harmonyClient.login(env.DISCORD_BOT_TOKEN);
	if (env.NODE_ENV === "production") {
		await harmonyLightClient.login(env.DISCORD_LIGHT_BOT_TOKEN);
	}
	console.log("Logged in");
	handleCommands();
	await registerCommands();
}
main();
