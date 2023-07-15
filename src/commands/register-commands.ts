import { ApplicationCommandManager, GuildApplicationCommandManager } from "discord.js";
import { harmonyClient, harmonyLightClient } from "..";
import env from "../shared/env";
import { getLightBotCommands, getOfficialBotCommands } from "./commands";

export const registerCommands = async (): Promise<void> => {
	if (env.NODE_ENV === "development") {
		// Ensures there are no application commands left from prod runs (see below),
		// uncomment if having trouble with duplicate or outdated commands:
		//
		// await clearAppCommands(harmonyClient.application?.commands);
		// await clearAppCommands(harmonyLightClient.application?.commands);
		const guild = await harmonyClient.guilds.fetch(
			env.DISCORD_GUILD_ID as string
		);
		await Promise.all(
			getOfficialBotCommands().map((
				command) => guild.commands.create(command)
			)
		);
	} else if (env.NODE_ENV === "production") {
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
