import { discordClient } from "..";
import { getGuild } from "../utils/guild";
import { handleAdd } from "./add/add.handler";
import { commands } from "./commands";
import { CommandNames } from "./command-names.enum";
import { handlePing } from "./ping/ping.handler";
import { handleVerify } from "./verify/verify.handler";

export const registerCommands = async () => {
	const guild = await getGuild();
	Promise.all(commands.map((command) => guild.commands.create(command)));

	discordClient.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		try {
			switch (interaction.commandName) {
				case CommandNames.PING:
					await handlePing(interaction);
					return;
				case CommandNames.ADD:
					await handleAdd(interaction);
					return;
				case CommandNames.VERIFY:
					await handleVerify(interaction);
					return;
				default:
					throw new Error(`Command name not found ${interaction.commandName}`);
			}
		} catch (error) {
			console.error(error);
		}
	});
};
