import { Env, harmonyClient } from "..";
import { getGuild } from "../shared/utils/guild";
import { lightBotCommands, officialBotCommands } from "./commands";

export const registerCommands = async (env: Env): Promise<void> => {
	if (env === "development") {
		const guild = await getGuild();
		await Promise.all(
			officialBotCommands.map((command) => guild.commands.create(command))
		);
	} else if (env === "production") {
		await Promise.all(
			officialBotCommands.map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
		await Promise.all(
			lightBotCommands.map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
	}
};
