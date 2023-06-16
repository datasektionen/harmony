import { GuildApplicationCommandManager } from "discord.js";
import { Env, harmonyClient, harmonyLightClient } from "..";
import { getGuild } from "../shared/utils/guild";
import { getLightBotCommands, getOfficialBotCommands } from "./commands";

export const registerCommands = async (env: Env): Promise<void> => {
	if (env === "development") {
		const guild = await getGuild();
		await Promise.all(
			(await getOfficialBotCommands()).map((
				command) => guild.commands.create(command)
			)
		);
	} else if (env === "production") {
		// Ensures there are no guild command left from dev runs (see above),
		// uncomment if having trouble with duplicate or outdated commands:
		//
		// clearCommands((await getGuild()).commands);
		await Promise.all(
			(await getOfficialBotCommands()).map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
		await Promise.all(
			(await getLightBotCommands()).map((command) =>
				harmonyLightClient.application?.commands?.create(command)
			)
		);
	}
};

// For emergency use, i.e. if someone puts dev guild commands into production
async function clearCommands(commands: GuildApplicationCommandManager): Promise<void> { // eslint-disable-line @typescript-eslint/no-unused-vars
	for (const [, command] of await commands.fetch()) {
		commands.delete(command)
	}
}