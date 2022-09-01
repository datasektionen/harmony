import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { getAliasChannels } from "./read-alias-mappings";
import { validCourseCode } from "./valid-course-code";

export const handleChannelAlias = async (
	alias: string,
	interaction: ChatInputCommandInteraction,
	actionCallback: (
		channel: TextChannel,
		interaction: ChatInputCommandInteraction
	) => Promise<void>
): Promise<void> => {
	const channelNames = getAliasChannels(alias);
	if (channelNames.length === 0) {
		return;
	}

	await interaction.guild?.channels.fetch();
	const channels = interaction.guild?.channels.cache.filter((current) =>
		channelNames.includes(current.name)
	);
	if (
		!channels ||
		channels.some((channel) => !(channel instanceof TextChannel))
	) {
		return;
	}

	const promises = channels.map((channel) =>
		actionCallback(channel as TextChannel, interaction)
	);
	await Promise.allSettled(promises);
	await interaction.reply({
		content: `Successfully updated your visibility for \`${alias}\`! (${channels.size}) channels updated`,
		ephemeral: true,
	});
	return;
};

export const handleChannel = async (
	courseCode: string,
	interaction: ChatInputCommandInteraction,
	actionCallback: (
		channel: TextChannel,
		interaction: ChatInputCommandInteraction
	) => Promise<void>
): Promise<void> => {
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
	await actionCallback(channel as TextChannel, interaction);

	await interaction.reply({
		content: `Successfully updated visibility for \`#${channel.name}\``,
		ephemeral: true,
	});
	return;
};
