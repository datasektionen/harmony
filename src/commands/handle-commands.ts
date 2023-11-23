import { harmonyClient, harmonyLightClient } from "..";
import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";
import { handleAdd } from "./add/add.handler";
import { CommandNames } from "./commands.names";
import { handleCourses } from "./courses/courses.handler";
import { handleJoin, handleJoinAutocomplete } from "./join/join.handler";
import { handleKick } from "./kick/kick.handler";
import { handleLeave } from "./leave/leave.handler";
import { handlePing } from "./ping/ping.handler";
import { handleVerify } from "./verify/verify.handler";
import { hasRoleN0llan, hasRoleVerified } from "../shared/utils/roles";
import type { GuildChatInputCommandInteraction } from "../shared/types/GuildChatInputCommandType";
import { handlePeriod } from "./period/period.handler";
import { handleMottagningsmode } from "./mottagningsmode/mottagningsmode.handler";
import { handleCommunity } from "./community/community.handler";
import { handleTranslateMsg } from "./translate/translateMsg.handler";
import { AutocompleteInteraction } from "discord.js";

export const handleCommands = (): void => {
	harmonyClient.on("interactionCreate", async (interaction) => {
		try {
			if (!interaction.guild) {
				throw new Error("Guild not found!");
			}

			if (interaction.isChatInputCommand()) {
				const guildInteraction =
					interaction as GuildChatInputCommandInteraction;

				// Checks which commands the user should have access to:
				if (await hasRoleVerified(interaction.user, interaction.guild)) {
					switch (interaction.commandName) {
						case CommandNames.PING:
							await handlePing(guildInteraction);
							return;
						case CommandNames.ADD:
							await handleAdd(guildInteraction);
							return;
						case CommandNames.KICK:
							await handleKick(guildInteraction);
							break;
						case CommandNames.VERIFY:
							await guildInteraction.reply({
								content: "You are already verified!",
								ephemeral: true,
							});
							return;
						case CommandNames.JOIN:
							await handleJoin(guildInteraction);
							return;
						case CommandNames.LEAVE:
							await handleLeave(guildInteraction);
							return;
						case CommandNames.COURSES:
							await handleCourses(guildInteraction);
							return;
						case CommandNames.PERIOD:
							await handlePeriod(guildInteraction);
							return;
						case CommandNames.MOTTAGNINGSMODE:
							await handleMottagningsmode(guildInteraction);
							return;
						case CommandNames.COMMUNITY:
							await handleCommunity(guildInteraction);
							return;
						default:
							throw new CommandNotFoundError(guildInteraction.commandName);
					}
				} else {
					const validCommands = Object.values(CommandNames) as string[]; // Get all valid command names
					if (guildInteraction.commandName === CommandNames.VERIFY) {
						await handleVerify(guildInteraction);
						return;
					} else if (validCommands.includes(guildInteraction.commandName)) {
						const permissionDeniedMessage = (await hasRoleN0llan(
							guildInteraction.user,
							guildInteraction.guild
						))
							? "Du är allt för schleeemig, kom tillbaka senare."
							: "Permission denied!\nYou first need to verify yourself using the '/verify' command.";
						await guildInteraction.reply({
							content: permissionDeniedMessage,
							ephemeral: true,
						});
					} else {
						throw new CommandNotFoundError(guildInteraction.commandName);
					}
				}
			} else if (interaction.isMessageContextMenuCommand()) {
				switch (interaction.commandName) {
					case CommandNames.TRANSLATE_MSG:
						await handleTranslateMsg(interaction);
						return;
					default:
						throw new CommandNotFoundError(interaction.commandName);
				}
			} else if (interaction.isAutocomplete()) {
				const autocompleteInteraction = interaction as AutocompleteInteraction


				switch (autocompleteInteraction.commandName) {
					case CommandNames.JOIN:
						await handleJoinAutocomplete(autocompleteInteraction);
						return;
					default:
						throw new CommandNotFoundError(interaction.commandName);
				}
			} else {
				console.warn("Unknown interaction type");
			}
		} catch (error) {
			console.warn(error);
		}
	});

	harmonyLightClient.on("interactionCreate", async (interaction) => {
		try {
			if (!interaction.guild) {
				throw new Error("Guild not found!");
			}
			if (interaction.isChatInputCommand()) {
			const guildInteraction = interaction as GuildChatInputCommandInteraction;
				switch (guildInteraction.commandName) {
					case CommandNames.VERIFY:
						await handleVerify(guildInteraction);
						return;
					default:
						throw new CommandNotFoundError(guildInteraction.commandName);
				}
			} else if (interaction.isMessageContextMenuCommand()) {
				switch (interaction.commandName) {
					case CommandNames.TRANSLATE_MSG:
						await handleTranslateMsg(interaction);
						return;
					default:
						throw new CommandNotFoundError(interaction.commandName);
				}
			} else {
				console.warn("Unknown interaction type");
			}
		} catch (error) {
			console.warn(error);
		}
	});
};
