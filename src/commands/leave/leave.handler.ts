import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { validCourseCode } from "../../shared/utils/valid-course-code";
import { LeaveVariables } from "./leave.variables";

export const handleLeave = async (
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const courseCode = options
		.getString(LeaveVariables.COURSE_CODE, true)
		.trim()
		.toLowerCase();
	if (!validCourseCode(courseCode)) {
		await interaction.reply({
			content: "The course code is not valid",
			ephemeral: true,
		});
		return;
	}

	await interaction.guild?.channels.fetch();
	const channel = interaction.guild?.channels.cache.find(
		({ name }) => name === courseCode
	);

	if (!(channel instanceof TextChannel)) {
		await interaction.reply({
			content: "Not a text channel...",
			ephemeral: true,
		});
		return;
	}
	await channel.permissionOverwrites.edit(interaction.user, {
		ViewChannel: false,
	});

	await interaction.reply({
		content: `Successfully left channel \`#${channel.name}\``,
		ephemeral: true,
	});
	return;
};
