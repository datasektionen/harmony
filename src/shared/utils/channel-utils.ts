import {
	ChatInputCommandInteraction,
	ForumChannel,
	GuildBasedChannel,
	TextChannel,
} from "discord.js";
import { AliasName } from "../alias-mappings";
import { getAliasChannels } from "./read-alias-mappings";
import { validCourseCode } from "./valid-course-code";

export type CourseChannel = ForumChannel | TextChannel;

const isCourseChannel = (channel?: GuildBasedChannel): boolean => {
	return (
		channel !== undefined &&
		(channel instanceof TextChannel || channel instanceof ForumChannel)
	);
};

export const handleChannelAlias = async (
	alias: string,
	interaction: ChatInputCommandInteraction,
	actionCallback: (
		channel: CourseChannel,
		interaction: ChatInputCommandInteraction
	) => Promise<void>
): Promise<void> => {
	const channelNames = getAliasChannels(alias as AliasName);
	if (channelNames.size === 0) {
		return;
	}
	await interaction.deferReply({
		ephemeral: true,
	});

	await interaction.guild?.channels.fetch();
	const channels = interaction.guild?.channels.cache
		.filter((current) => channelNames.has(current.name.split("-")[0]))
		.filter(isCourseChannel);
	if (!channels) {
		return;
	}

	const promises = channels.map((channel) =>
		actionCallback(channel as CourseChannel, interaction)
	);
	await Promise.allSettled(promises);
	await interaction.editReply({
		content: `Successfully updated your visibility for \`${alias}\`! (${channels.size}) channels updated`,
	});
	return;
};

export const handleChannel = async (
	courseCode: string,
	interaction: ChatInputCommandInteraction,
	actionCallback: (
		channel: ForumChannel | TextChannel,
		interaction: ChatInputCommandInteraction
	) => Promise<void>
): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });
	if (!validCourseCode(courseCode)) {
		await interaction.editReply({
			content: "The course code is not valid",
		});
		return;
	}

	await interaction.guild?.channels.fetch();
	const channel = interaction.guild?.channels.cache.find(({ name }) =>
		name.startsWith(courseCode)
	);

	if (!isCourseChannel(channel)) {
		await interaction.editReply({
			content:
				"Channel not found, please contact a mod if you think this is a mistake",
		});
		return;
	}

	await actionCallback(channel as CourseChannel, interaction);

	await interaction.editReply({
		content: `Successfully updated visibility for \`#${
			(channel as CourseChannel).name
		}\``,
	});
	return;
};
