import { MessageFlags } from "discord.js";
import { jobs } from "../../../../index";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export const handleDfunkStatus = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	// We assume that this job is loaded
	const dfunkUpdateJob = jobs.get("updateDfunkRoles")!;
	const lastExecution = dfunkUpdateJob.job.lastExecution;
	const activeJob = dfunkUpdateJob.job.isActive;
	let content = "The automatic dfunk role update is "
	if (!activeJob) content += "in";
	content += "active. The automatic update ";
	if (lastExecution !== null) {
		content += `was last executed ${ lastExecution }.`;
	} else {
		content += "has not been executed yet.";
	}
	if (activeJob) {
		content += ` The next automatic update will be executed ${dfunkUpdateJob.job.nextDate()}.`;
	}
	content += " To toggle this functionality on/off, use the `/dfunk toggle` command.";
	await interaction.reply({
			content: content,
			flags: MessageFlags.Ephemeral,
	});
};
