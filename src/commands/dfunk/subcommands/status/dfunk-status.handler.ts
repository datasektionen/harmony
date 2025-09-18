import { MessageFlags } from "discord.js";
import { jobs } from "../../../../index";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export const handleDfunkStatus = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	// We assume that this job is loaded
	const dfunkUpdateJob = jobs.get("updateDfunkRoles")!;
	const jobStatus = dfunkUpdateJob.job.isActive;
	if (jobStatus) {
		await interaction.reply({
			content: `The automatic dfunk role update is active.
            The automatic update was last executed ${
				dfunkUpdateJob.job.lastExecution
			}.
            The next automatic update will be executed ${dfunkUpdateJob.job.nextDate()}
            To toggle this functionality on/off, use the \`/dfunk toggle\` command.
            `,
			flags: MessageFlags.Ephemeral,
		});
	} else {
		await interaction.reply({
			content: `The automatic dfunk role update is inactive.
            The automatic update was last executed ${dfunkUpdateJob.job.lastExecution}.
            To toggle this functionality on/off, use the \`/dfunk toggle\` command.`,
			flags: MessageFlags.Ephemeral,
		});
	}
};
