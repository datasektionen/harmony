import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { JoinVariables } from "./join.variables";
import { validCourseCode } from "../../shared/utils/valid-course-code";

export const handleJoin = async (
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const courseCode = options
		.getString(JoinVariables.COURSE_CODE, true)
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
	await channel.permissionOverwrites.create(interaction.user, {
		ViewChannel: true,
	});

	await interaction.reply({
		content: `Successfully joined \`#${channel.name}\``,
		ephemeral: true,
	});
	return;
};
