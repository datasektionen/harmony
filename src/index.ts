import { Client as DiscordClient } from "discord.js";
import { validateEnvironment } from "./utils";
import { onMessage } from "./messages/on_message";

export const discordClient = new DiscordClient();

function main() {
	validateEnvironment();

	discordClient.once("ready", () => console.log("Starting..."));
	discordClient
		.login(process.env.DISCORD_TOKEN)
		.then(() => console.log("Logged in!"));
	discordClient.on("message", onMessage);
}
main();
