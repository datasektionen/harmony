import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { jobs } from "../../../../index";
import { MessageFlags } from "discord.js";

export const handleDfunkToggle = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	// We assume that this job is loaded
	const dfunkUpdateJob = jobs.get("updateDfunkRoles")!;
	const jobStatus = dfunkUpdateJob.job.isActive;
	if (jobStatus) {
		await dfunkUpdateJob.job.stop();
		await interaction.reply({
			content:`
            The automatic dfunk role update has been turned off.
            Use this same command (\`/dfunk toggle\`) to turn on this functionality.`,
			flags: MessageFlags.Ephemeral});
	} else {
		await dfunkUpdateJob.job.start();
		await interaction.reply({
			content:`The automatic dfunk role update has been turned on.
            The next automatic update will be executed ${dfunkUpdateJob.job.nextDate()}.
            Use this same command (\`/dfunk toggle\`) to turn off this functionality.`,
			flags: MessageFlags.Ephemeral
	});
	}
};
