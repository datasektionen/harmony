import { Env, harmonyClient, harmonyLightClient } from "..";
import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";
import { handleAdd } from "./add/add.handler";
import { CommandNames } from "./commands.names";
import { handleCourses } from "./courses/courses.handler";
import { handleJoin } from "./join/join.handler";
import { handleKick } from "./kick/kick.handler";
import { handleLeave } from "./leave/leave.handler";
import { handlePing } from "./ping/ping.handler";
import { handleVerify } from "./verify/verify.handler";
import { hasRoleVerified } from "../shared/utils/roles";

export const handleCommands = (env: Env): void => {
	harmonyClient.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) {
			return;
		}
		try {
			const { user, guild } = interaction;
			if (!guild) {
				throw new Error("Couldn't get guild from interaction!");
			}
			// Checks which commands the user should have access to:
			if (await hasRoleVerified(user, guild)) {
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
						await interaction.reply({
							content: "You are already verified!",
							ephemeral: true,
						});
						return;
					case CommandNames.JOIN:
						await handleJoin(interaction);
						return;
					case CommandNames.LEAVE:
						await handleLeave(interaction);
						return;
					case CommandNames.COURSES:
						await handleCourses(interaction);
						return;
					default:
						throw new CommandNotFoundError(interaction.commandName);
				}
			} else {
				const validCommands = Object.values(CommandNames) as string[]; // Get all valid command names
				if (interaction.commandName === CommandNames.VERIFY) {
					await handleVerify(interaction);
					return;
				} else if (validCommands.includes(interaction.commandName)) {
					await interaction.reply({
						content:
							"Permission denied!\nYou first need to verify yourself using the '/verify begin' command.",
						ephemeral: true,
					});
				} else {
					throw new CommandNotFoundError(interaction.commandName);
				}
			}
		} catch (error) {
			console.warn(error);
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
				console.warn(error);
			}
		});
	}
};
