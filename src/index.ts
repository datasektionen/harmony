import { Client as DiscordClient } from "discord.js";
import { onMessage } from "./messages/on_message";
import { onWelcome } from "./messages/on_welcome";

/**
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

export const discordClient = new DiscordClient();

function main() {
	validateEnvironment();

	discordClient.once("ready", () => console.log("Starting..."));
	discordClient
		.login(process.env.DISCORD_TOKEN)
		.then(() => console.log("Logged in!"));
	discordClient.on("message", onMessage);
	discordClient.on("guildMemberAdd", onWelcome);
}
main();
