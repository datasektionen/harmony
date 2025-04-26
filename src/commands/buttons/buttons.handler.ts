import { COURSE_BUTTON_LABELS, VERIFY_BUTTON_LABELS } from "./subcommands/util";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { GuildButtonInteraction } from "../../shared/types/GuildButtonInteraction";
import { ButtonsSubcommands } from "./buttons-subcommands.names";
import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import {
	handleButtonsCourses,
	handleCourseButtonInteraction,
} from "./subcommands/courses/buttons-courses.handler";
import {
	handleButtonsVerify,
	handleVerifyButtonInteraction,
} from "./subcommands/verify/buttons-verify.handler";
import { MessageFlags } from "discord.js";

export async function handleButtons(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	switch (subcommandName) {
		case ButtonsSubcommands.COURSES:
			return await handleButtonsCourses(interaction);
		case ButtonsSubcommands.VERIFY:
			return await handleButtonsVerify(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
}

export async function handleButtonInteraction(
	interaction: GuildButtonInteraction
): Promise<void> {
	const courseButtonIds = COURSE_BUTTON_LABELS.map((label) =>
		label.toString()
	);
	const verifyButtonIds = VERIFY_BUTTON_LABELS.map((label) =>
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
		console.warn(
			`An unknown button was interacted with (customId = ${interaction.customId}).`
		);
	}
}
