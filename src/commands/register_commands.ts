import { discordClient } from "..";
import { getGuild } from "../utils/guild";
import { handleAdd } from "./add/add.handler";
import { commands } from "./commands";
import { CommandNames } from "./command.names";
import { handlePing } from "./ping/ping.handler";

export const register_commands = async () => {
	const guild = await getGuild();
	commands.forEach((command) => guild.commands.create(command));

	discordClient.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) {
			return;
		}
		switch (interaction.commandName) {
			case CommandNames.PING:
				handlePing(interaction);
				break;
			case CommandNames.ADD:
				handleAdd(interaction);
				break;
		}
	});
};
