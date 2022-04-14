import { Client as DiscordClient } from "discord.js";
import { configDatabase } from "./database_config";
import { validateEnvironment } from "./utils";
import { onMessage } from "./on_message";

export const discordClient = new DiscordClient();

function main() {
  validateEnvironment();
  configDatabase();

  discordClient.once("ready", () => console.log("Starting..."));
  discordClient.login(process.env.DISCORD_TOKEN).then(console.log("Logged in!"));
  discordClient.on("message", onMessage);
}
main();
