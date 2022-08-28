import { discordClient } from "..";
import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";
import { getGuild } from "../shared/utils/guild";
import { handleAdd } from "./add/add.handler";
import { commands } from "./commands";
import { CommandNames } from "./commands.names";
import { handleKick } from "./kick/kick.handler";
import { handlePing } from "./ping/ping.handler";
import { handleVerify } from "./verify/verify.handler";

export const registerCommands = async (): Promise<void> => {
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
				case CommandNames.KICK:
					await handleKick(interaction);
					break;
				case CommandNames.VERIFY:
					await handleVerify(interaction);
					return;
				default:
					throw new CommandNotFoundError(interaction.commandName);
			}
		} catch (error) {
			console.error(error);
		}
	});
};
