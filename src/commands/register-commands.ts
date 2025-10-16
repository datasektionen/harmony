import { harmonyClient, harmonyLightClient } from "..";
import { info } from "../shared/utils/log";
import { testCommand, testSubcommandNames } from "../tests/test";
import { getLightBotCommands, getOfficialBotCommands } from "./commands";

export const registerCommands = async (): Promise<void> => {
	if (process.env.DISCORD_BOT_TOKEN) {
		await Promise.all(
			(
				await getOfficialBotCommands()
			).map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
		// Only add 'test' command if some subcommands for it are defined
		if (testSubcommandNames.length) {
			await harmonyClient.application?.commands?.create(testCommand);
			info("'test' command created.");
		}
	}

	if (process.env.DISCORD_LIGHT_BOT_TOKEN) {
		await Promise.all(
			(
				await getLightBotCommands()
			).map((command) =>
				harmonyLightClient.application?.commands?.create(command)
			)
		);
		if (testSubcommandNames.length) {
			await harmonyLightClient.application?.commands?.create(testCommand);
			info("'test' command created.");
		}
	}
};
