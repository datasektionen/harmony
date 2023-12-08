import { ApplicationCommandManager, GuildApplicationCommandManager } from "discord.js";
import { Env, harmonyClient, harmonyLightClient } from "..";
import { getGuild } from "../shared/utils/guild";
import { getLightBotCommands, getOfficialBotCommands } from "./commands";

export const registerCommands = async (env: Env): Promise<void> => {
	if (env === "development") {
		// Ensures there are no application commands left from prod runs (see below),
		// uncomment if having trouble with duplicate or outdated commands:
		//
		// await clearAppCommands(harmonyClient.application?.commands);
		// await clearAppCommands(harmonyLightClient.application?.commands);
		const guild = await getGuild();
		await Promise.all(
			getOfficialBotCommands().map((
				command) => guild.commands.create(command)
			)
		);
	} else if (env === "production") {
		// Ensures there are no guild commands left from dev runs (see above),
		// uncomment if having trouble with duplicate or outdated commands:
		//
		// await clearGuildCommands((await getGuild()).commands);
		await Promise.all(
			getOfficialBotCommands().map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
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