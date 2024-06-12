import { harmonyClient, harmonyLightClient } from "..";
import { getLightBotCommands, getOfficialBotCommands } from "./commands";

export const registerCommands = async (): Promise<void> => {
	if (process.env.DISCORD_BOT_TOKEN) {
		await Promise.all(
			(await getOfficialBotCommands()).map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
	}
	if (process.env.DISCORD_LIGHT_BOT_TOKEN) {
		await Promise.all(
			(await getLightBotCommands()).map((command) =>
				harmonyLightClient.application?.commands?.create(command)
			)
		);
	}
};
