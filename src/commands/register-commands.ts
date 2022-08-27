import { discordClient } from "..";
import { getGuild } from "../utils/guild";
import { handleAdd } from "./add/add.handler";
import { commands } from "./commands";
import { CommandNames } from "./command-names.enum";
import { handlePing } from "./ping/ping.handler";
import { handleVerify } from "./verify/verify.handler";

export const registerCommands = async () => {
	const guild = await getGuild();
	commands.forEach((command) => guild.commands.create(command));

	discordClient.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		switch (interaction.commandName) {
			case CommandNames.PING:
				return await handlePing(interaction);
			case CommandNames.ADD:
				return await handleAdd(interaction);
			case CommandNames.VERIFY:
				return await handleVerify(interaction);
		}
	});
};
