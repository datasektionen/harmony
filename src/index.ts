import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import { registerCommands } from "./commands/register-commands";
import { onMessage } from "./messages/on-message";
import { onWelcome } from "./messages/on-welcome";

/**p
 * Goes through all dotenv vars and checks if they are defined.
 * If not, the service will throw and error
 */
function validateEnvironment() {
	if (
		!process.env.SPAM_URL ||
		!process.env.SPAM_API_TOKEN ||
		!process.env.DISCORD_TOKEN ||
		!process.env.DISCORD_GUILD_ID
	) {
		if (process.env.NODE_ENV === "development")
			throw new Error("Missing proper configuration!");
	}
}

export const discordClient = new DiscordClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

async function main() {
	validateEnvironment();

	discordClient.once("ready", () => console.log("Starting..."));
	await discordClient.login(process.env.DISCORD_TOKEN);
	console.log("Logged in");

	discordClient.on("message", onMessage);
	discordClient.on("guildMemberAdd", onWelcome);
	registerCommands();
}
main();
