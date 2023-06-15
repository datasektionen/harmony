import { Env, harmonyClient } from "..";
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
		await Promise.all(
			(await getOfficialBotCommands()).map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
		await Promise.all(
			(await getLightBotCommands()).map((command) =>
				harmonyClient.application?.commands?.create(command)
			)
		);
	}
};
