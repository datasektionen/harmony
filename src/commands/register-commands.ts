import { harmonyClient, harmonyLightClient } from "..";
import { info } from "../shared/utils/log";
import { testCommand, initTestCommand } from "../tests/test";
import { getLightBotCommands, getOfficialBotCommands } from "./commands";
import { testCommand } from "../tests/test.command";
import { TestSubcommands } from "../tests/test-subcommands";

export const registerCommands = async (): Promise<void> => {
	const loadedTestSubcommands = await initTestCommand();
	if (process.env.DISCORD_BOT_TOKEN) {
		await Promise.all(
			(
				await getOfficialBotCommands()
			).map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
		// Only add 'test' command if some subcommands for it were loaded
		if (loadedTestSubcommands) {
			await harmonyClient.application?.commands?.create(testCommand);
			info("'test' command registered.");
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
		if (loadedTestSubcommands) {
			await harmonyClient.application?.commands?.create(testCommand);
			info("'test' command registered.");
		}
	}
};
