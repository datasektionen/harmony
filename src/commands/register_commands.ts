import { discordClient } from "..";
import { getGuild } from "../utils/guild";
import { handleAdd } from "./add/add.handler";
import { commands } from "./commands";
import { CommandNames } from "./command.names";
import { handlePing } from "./ping/ping.handler";
import { handleVerify } from "./verify/verify.handler";

export const register_commands = async () => {
	const guild = await getGuild();
	commands.forEach((command) => guild.commands.create(command));

	discordClient.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) {
			return;
		}
		switch (interaction.commandName) {
			case CommandNames.PING:
				await handlePing(interaction);
				break;
			case CommandNames.ADD:
				await handleAdd(interaction);
				break;
			case CommandNames.VERIFY:
				await handleVerify(interaction);
				break;
		}
	});
};
