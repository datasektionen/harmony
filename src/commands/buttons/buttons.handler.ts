import {
	COURSE_BUTTON_LABELS,
	UN_ABOOD_BUTTON_CUSTOMID,
	VERIFY_BUTTON_LABELS,
} from "./subcommands/util";
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
import * as log from "../../shared/utils/log";
import { removeRole } from "../../shared/utils/roles";

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
	// buttonInteraction originated from the un-abood button.
	else if (interaction.customId.startsWith(UN_ABOOD_BUTTON_CUSTOMID)) {
		// Each un-Abood button has a unique customId that ends with the Abooded user's id.
		if (interaction.customId.endsWith(interaction.user.id)) {
			// Should never fail as this button can only be generated where @abood is mentioned.
			await removeRole(interaction.user, "abood", interaction.guild);
			log.info(
				`Removed role @abood from user ${interaction.member?.user.username}`
			);

			// I hope that people don't abuse this to spam channels with un-abood messages.
			await interaction.reply("You have successfully been un-Abooded!");
			return;
		} else {
			// Ephemeral to prevent spam :)
			await interaction.reply({
				content: "This un-Abood button does not belong to you!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
	}
	// Should be unreachable.
	else {
		log.warning(
			`An unknown button was interacted with (customId = ${interaction.customId}).`
		);
	}
}
