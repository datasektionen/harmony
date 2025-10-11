import { harmonyClient, harmonyLightClient } from "..";
import { TestSubcommands } from "../tests/test-subcommands";
import { testCommand } from "../tests/test.command";
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
	}
	// Only add 'test' command if some subcommands for it are defined
	if (Object.keys(TestSubcommands).length) {
		await harmonyClient.application?.commands?.create(testCommand);
	}
	if (process.env.DISCORD_LIGHT_BOT_TOKEN) {
		await Promise.all(
			(
				await getLightBotCommands()
			).map((command) =>
				harmonyLightClient.application?.commands?.create(command)
			)
		);
	}
	if (Object.keys(TestSubcommands).length) {
		await harmonyLightClient.application?.commands?.create(testCommand);
	}
};
