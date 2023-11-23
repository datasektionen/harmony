import { ApplicationCommandManager, GuildApplicationCommandManager } from "discord.js";
import { Env, harmonyClient, harmonyLightClient } from "..";
import { getGuild } from "../shared/utils/guild";
import { getLightBotCommands, getOfficialBotCommands } from "./commands";

export const registerCommands = async (env: Env): Promise<void> => {
	if (process.env.DISCORD_BOT_TOKEN) {
		// Ensures there are no application commands left from light runs
		await clearAppCommands(harmonyClient.application?.commands);

		await Promise.all(
			getOfficialBotCommands().map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
	}
	if (process.env.DISCORD_LIGHT_BOT_TOKEN) {
		// Ensures there are no guild commands left from non-light runs
		await clearAppCommands(harmonyLightClient.application?.commands);

		await Promise.all(
			getLightBotCommands().map((command) =>
				harmonyLightClient.application?.commands?.create(command)
			)
		);
	}
};

// For emergency use, i.e. if someone puts dev guild commands into production
async function clearGuildCommands(commands?: GuildApplicationCommandManager): Promise<void> { // eslint-disable-line @typescript-eslint/no-unused-vars
	if (!commands) {
		return;
	}
	for (const [, command] of await commands.fetch()) {
		commands.delete(command)
	}
}

// For use if someone puts prod application commands into development
async function clearAppCommands(commands?: ApplicationCommandManager): Promise<void> { // eslint-disable-line @typescript-eslint/no-unused-vars
	if (!commands) {
		return;
	}
	for (const [, command] of await commands.fetch()) {
		commands.delete(command)
	}
}