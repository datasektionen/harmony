import {
	COURSE_BUTTON_CUSTOM_IDS,
	COURSE_BUTTON_LABELS,
	generateButtons,
	VERIFY_BUTTON_CUSTOM_IDS,
} from "./subcommands/util";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { GuildButtonInteraction } from "../../shared/types/GuildButtonInteraction";
import { ButtonsSubcommands } from "./buttons-subcommands.names";
import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { handleCourseButtonInteraction } from "./subcommands/courses/buttons-courses.handler";
import {
	handleButtonsVerify,
	handleVerifyButtonInteraction,
} from "./subcommands/verify/buttons-verify.handler";
import { MessageFlags } from "discord.js";
import * as log from "../../shared/utils/log";

export async function handleButtons(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	switch (subcommandName) {
		case ButtonsSubcommands.COURSES:
			return await generateButtons(
				interaction,
				COURSE_BUTTON_LABELS,
				3,
				COURSE_BUTTON_CUSTOM_IDS
			);
		case ButtonsSubcommands.VERIFY:
			return await handleButtonsVerify(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
}

export async function handleButtonInteraction(
	interaction: GuildButtonInteraction
): Promise<void> {
	const courseButtonIds = COURSE_BUTTON_CUSTOM_IDS.map((label) =>
		label.toString()
	);
	const verifyButtonIds = VERIFY_BUTTON_CUSTOM_IDS.map((label) =>
		label.toString()
	);

	// interaction originated from pressing a course button.
	if (courseButtonIds.includes(interaction.customId)) {
		return await handleCourseButtonInteraction(interaction);
	}
	// buttonInteraction originated from pressing a verify button.
	else if (verifyButtonIds.includes(interaction.customId)) {
		return await handleVerifyButtonInteraction(interaction);
	}
	// Should be unreachable.
	else {
		log.warning(
			`An unknown button was interacted with (customId = ${interaction.customId}).`
		);
	}
}
