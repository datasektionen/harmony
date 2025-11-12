import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";
import { CommandNames } from "./commands.names";
import { handleCourses } from "./courses/courses.handler";
import { handleJoin, handleJoinAutocomplete } from "./join/join.handler";
import { handleLeave } from "./leave/leave.handler";
import { handleVerify } from "./verify/verify.handler";
import { hasRoleN0llan, hasRoleVerified } from "../shared/utils/roles";
import type { GuildChatInputCommandInteraction } from "../shared/types/GuildChatInputCommandType";
import type { GuildButtonInteraction } from "../shared/types/GuildButtonInteraction";
import type { GuildModalSubmitInteraction } from "../shared/types/GuildModalSubmitInteraction";
import {
	handleButtonInteraction,
	handleButtons,
} from "./buttons/buttons.handler";
import {
	handleCommunity,
	handleCommunityAutocomplete,
} from "./community/community.handler";
import { handleTranslateMsg } from "./translate/translateMsg.handler";
import { handleClub } from "./club/club.handler";
import { handleMessage } from "./message/message.handler";
import { BaseInteraction, MessageFlags, Interaction } from "discord.js";
import { handleKthId } from "./kthid/kthid.handler";
import {
	VERIFY_MODAL_CUSTOM_IDS,
	VerifyModalCustomIds,
} from "./buttons/subcommands/util";
import { handleVerifyBegin } from "./verify/subcommands/begin/verify-begin.handler";
import { isDarkmode } from "../shared/utils/darkmode";
import { handleVerifySubmit } from "./verify/subcommands/submit/verify-submit.handler";
import { handleVerifyNollan } from "./verify/subcommands/nollan/verify-nollan.handler";
import { handleNollegrupp } from "./nollegrupp/nollegrupp.handler";
import * as log from "../shared/utils/log";
import { handleMottagningen } from "./mottagningen/mottagningen.handler";

export async function handleInteractions(
	interaction: Interaction
): Promise<void> {
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
		} else if (interaction.isModalSubmit()) {
			const guildModalSubmitInteraction =
				interaction as GuildModalSubmitInteraction;

			await modalSubmitInteractionHandler(guildModalSubmitInteraction);
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
			log.warning("Unknown interaction type");
		}
	} catch (error) {
		await interaction_error_reply(interaction);
		log.error(`${error}`);
	}
}

async function modalSubmitInteractionHandler(
	interaction: GuildModalSubmitInteraction
): Promise<void> {
	const darkmode = await isDarkmode();
	const verifyModalCustomIds = VERIFY_MODAL_CUSTOM_IDS.map((id) =>
		id.toString()
	);

	// Add check for whether user has already been verified.
	if (verifyModalCustomIds.includes(interaction.customId)) {
		if (
			(await hasRoleVerified(interaction.user, interaction.guild)) &&
			!(await hasRoleN0llan(interaction.user, interaction.guild))
		) {
			await interaction.reply({
				content: "You are already verified!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		switch (interaction.customId) {
			case VerifyModalCustomIds.BEGIN:
				await handleVerifyBegin(interaction, darkmode);
				return;
			case VerifyModalCustomIds.NOLLAN:
				await handleVerifyNollan(interaction);
				return;
			case VerifyModalCustomIds.SUBMIT:
				await handleVerifySubmit(interaction);
				return;
			default:
				log.warning("Unexpected verify modal interaction");
				return;
		}
	}
	// Should be unreachable.
	else {
		log.warning(
			`An unknown modal was interacted with (customId: ${interaction.customId})`
		);
	}
}

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
						flags: MessageFlags.Ephemeral,
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
				case CommandNames.NOLLEGRUPP:
					handleNollegrupp(guildInteraction);
					return;
				case CommandNames.MOTTAGNINGEN:
					handleMottagningen(guildInteraction);
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
					? "Endast en *teknolog* får använda det kommandot, nØllan."
					: "Permission denied!\nYou first need to verify yourself using the '/verify' command.";
				await guildInteraction.reply({
					content: permissionDeniedMessage,
					flags: MessageFlags.Ephemeral,
				});
			} else {
				throw new CommandNotFoundError(guildInteraction.commandName);
			}
		}
	} catch (error) {
		log.error(`${error}`);
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
				await interaction.reply({
					content: message,
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	} catch (error) {
		log.warning(
			`Error when trying to send error message to user: ${error}`
		);
	}
}
