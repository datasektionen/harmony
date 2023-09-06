import { mappings } from "../../shared/alias-mappings";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { isCourseChannel } from "../../shared/utils/channel-utils";
import { validCourseCode } from "../../shared/utils/valid-course-code";

export const handleCourses = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const lines = [];
	const aliasedChannels: string[] = [];
	for (const [key, value] of Object.entries(mappings)) {
		if (value.length === 0 || validCourseCode(key)) continue;
		lines.push(`**${key}**:\n`);
		for (let i = 0; i < value.length; i++) {
			lines.push(`${value[i]}${i === value.length - 1 ? "" : ", "}`);
			aliasedChannels.push(value[i]);
		}
		lines.push("\n");
	}

	await interaction.guild.channels.fetch();
	const nonIncludedChannelNames = interaction.guild.channels.cache
		.filter(isCourseChannel)
		.filter((channel) => validCourseCode(channel.name))
		.filter(
			(channel) =>
				!aliasedChannels.some((current) => channel.name.startsWith(current))
		)
		.map((channel) => channel.name);

	if (nonIncludedChannelNames) {
		lines.push("**other courses:**\n");
		for (let i = 0; i < nonIncludedChannelNames.length; i++) {
			lines.push(
				`${nonIncludedChannelNames[i].split("-")[0]}${
					i === nonIncludedChannelNames.length - 1 ? "" : ", "
				}`
			);
			aliasedChannels.push(nonIncludedChannelNames[i]);
		}
	}

	await interaction.reply({
		content: lines.join(""),
		ephemeral: true,
	});
	return;
};
