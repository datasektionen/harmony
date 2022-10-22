import { Env, harmonyClient, harmonyLightClient } from "..";
import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";
import { handleAdd } from "./add/add.handler";
import { CommandNames } from "./commands.names";
import { handleJoin } from "./join/join.handler";
import { handleKick } from "./kick/kick.handler";
import { handleLeave } from "./leave/leave.handler";
import { handlePing } from "./ping/ping.handler";
import { handleVerify } from "./verify/verify.handler";

export const handleCommands = (env: Env): void => {
	harmonyClient.on("interactionCreate", async (interaction) => {
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
				case CommandNames.JOIN:
					await handleJoin(interaction);
					return;
				case CommandNames.LEAVE:
					await handleLeave(interaction);
					return;
				default:
					throw new CommandNotFoundError(interaction.commandName);
			}
		} catch (error) {
			console.error(error);
		}
	});

	if (env === "production") {
		harmonyLightClient.on("interactionCreate", async (interaction) => {
			if (!interaction.isChatInputCommand()) {
				return;
			}
			try {
				switch (interaction.commandName) {
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
	}
};
