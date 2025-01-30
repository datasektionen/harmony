import { harmonyClient, harmonyLightClient } from "..";
import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";
import { CommandNames } from "./commands.names";
import { handleCourses } from "./courses/courses.handler";
import { handleJoin, handleJoinAutocomplete } from "./join/join.handler";
import { handleLeave } from "./leave/leave.handler";
import { handleVerify } from "./verify/verify.handler";
import { hasRoleN0llan, hasRoleVerified } from "../shared/utils/roles";
import type { GuildChatInputCommandInteraction } from "../shared/types/GuildChatInputCommandType";
import type { GuildButtonInteraction } from "../shared/types/GuildButtonInteraction";
import { handlePeriod } from "./period/period.handler";
import { handleButtonInteraction, handleButtons } from "./buttons/buttons.handler";
import {
	handleCommunity,
	handleCommunityAutocomplete,
} from "./community/community.handler";
import { handleTranslateMsg } from "./translate/translateMsg.handler";
import { handleClub } from "./club/club.handler";
import { handleMessage } from "./message/message.handler";
import { BaseInteraction } from "discord.js";
import { handleKthId } from "./kthid/kthid.handler";

export const handleCommands = (): void => {
	harmonyClient.on("interactionCreate", async (interaction) => {
		try {
			if (!interaction.guild) {
				throw new Error("Guild not found!");
			}

			if (interaction.isChatInputCommand()) {
				await handleChatInputCommand(
					interaction as GuildChatInputCommandInteraction
				);
			} else if (interaction.isMessageContextMenuCommand()) {
				switch (interaction.commandName) {
					case CommandNames.TRANSLATE_MSG:
						await handleTranslateMsg(interaction);
						return;
					default:
						throw new CommandNotFoundError(interaction.commandName);
				}
			} else if (interaction.isButton()) {
				const buttonInteraction = interaction as GuildButtonInteraction;

				await handleButtonInteraction(buttonInteraction);
			} else if (interaction.isAutocomplete()) {
				switch (interaction.commandName) {
					case CommandNames.JOIN:
						await handleJoinAutocomplete(interaction);
						return;
					case CommandNames.COMMUNITY:
						await handleCommunityAutocomplete(interaction);
						return;
					default:
						throw new CommandNotFoundError(interaction.commandName);
				}
			} else {
				console.warn("Unknown interaction type");
			}
		} catch (error) {
			await interaction_error_reply(interaction);
			console.warn(error);
		}
	});

	harmonyLightClient.on("interactionCreate", async (interaction) => {
		try {
			if (!interaction.guild) {
				throw new Error("Guild not found!");
			}
			if (interaction.isChatInputCommand()) {
				const guildInteraction =
					interaction as GuildChatInputCommandInteraction;
				switch (guildInteraction.commandName) {
					case CommandNames.VERIFY:
						await handleVerify(guildInteraction);
						return;
					default:
						throw new CommandNotFoundError(
							guildInteraction.commandName
						);
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
			await interaction_error_reply(interaction);
			console.warn(error);
		}
	});
};

const handleChatInputCommand = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	try {
		const guildInteraction =
			interaction as GuildChatInputCommandInteraction;
		// Checks which commands the user should have access to:
		if (await hasRoleVerified(interaction.user, interaction.guild)) {
			switch (interaction.commandName) {
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
				case CommandNames.BUTTONS:
					await handleButtons(guildInteraction);
					return;
				case CommandNames.COMMUNITY:
					await handleCommunity(guildInteraction);
					return;
				case CommandNames.CLUB:
					await handleClub(guildInteraction);
					return;
				case CommandNames.MESSAGE:
					await handleMessage(guildInteraction);
					return;
				case CommandNames.KTHID:
					await handleKthId(guildInteraction);
					return;
				default:
					throw new CommandNotFoundError(
						guildInteraction.commandName
					);
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
	} catch (error) {
		console.warn(error);
	}
};

async function interaction_error_reply(
	interaction: BaseInteraction
): Promise<void> {
	const message =
		"This interaction could not be completed. Please contact an admin.";
	try {
		if (interaction.isChatInputCommand()) {
			if (interaction.deferred || interaction.replied) {
				await interaction.editReply({ content: message });
			} else {
				await interaction.reply({ content: message, ephemeral: true });
			}
		}
	} catch (error) {
		console.warn("Error when trying to send error message to user:", error);
	}
}
