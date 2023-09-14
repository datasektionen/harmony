import { ForumChannel, GuildBasedChannel, TextChannel } from "discord.js";
import { AliasName } from "../alias-mappings";
import { GuildChatInputCommandInteraction } from "../types/GuildChatInputCommandType";
import { getAliasChannels } from "./read-alias-mappings";
import { validCourseCode } from "./valid-course-code";

export type CourseChannel = ForumChannel | TextChannel;

export const isCourseChannel = (channel?: GuildBasedChannel): boolean => {
	return (
		channel !== undefined &&
		(channel instanceof TextChannel || channel instanceof ForumChannel)
	);
};

export const handleChannelAlias = async (
	alias: string,
	interaction: GuildChatInputCommandInteraction,
	actionCallback: (
		channel: CourseChannel,
		interaction: GuildChatInputCommandInteraction
	) => Promise<void>,
	noInteraction?: boolean
): Promise<void> => {
	noInteraction = noInteraction ?? false;

	const channelNames = getAliasChannels(alias as AliasName);
	if (channelNames.size === 0) {
		return;
	}
	if (!noInteraction && !interaction.replied) {
		await interaction.deferReply({
			ephemeral: true,
		});
	}

	await interaction.guild.channels.fetch();
	const channels = interaction.guild.channels.cache
		.filter((current) => channelNames.has(current.name.split("-")[0]))
		.filter(isCourseChannel);
	if (!channels) {
		return;
	}

	const promises = channels.map((channel) =>
		actionCallback(channel as CourseChannel, interaction)
	);
	await Promise.allSettled(promises);
	if (!noInteraction && !interaction.replied) {
		await interaction.editReply({
			content: `Successfully updated your visibility for \`${alias}\`! (${channels.size}) channels updated`,
		});
	}
	return;
};

export const handleChannel = async (
	courseCode: string,
	interaction: GuildChatInputCommandInteraction,
	actionCallback: (
		channel: ForumChannel | TextChannel,
		interaction: GuildChatInputCommandInteraction
	) => Promise<void>,
	noInteraction?: boolean,
	skipCheckingCourseCode?: boolean,
): Promise<void> => {
	noInteraction = noInteraction ?? false;
	if (!noInteraction) {
		await interaction.deferReply({ ephemeral: true });
	}

	await interaction.guild.channels.fetch();
	const channel = interaction.guild.channels.cache.find(({ name }) =>
		name.startsWith(courseCode + "-")
	);

	// If no course was found, return with a message.
	// If we skip checking the course code (e.g. in verify-nollan) continue the function
	// If the course code was invalid, return with a message.
	if (channel == undefined || (!skipCheckingCourseCode && !validCourseCode(channel.name))) {
		if (!noInteraction) {
			await interaction.editReply({
				content: "The course code is not valid",
			});
		}
		return;
	}

	if (!isCourseChannel(channel)) {
		if (!noInteraction) {
			await interaction.editReply({
				content:
					"Channel not found, please contact a mod if you think this is a mistake",
			});
		}
		return;
	}

	await actionCallback(channel as CourseChannel, interaction);

	if (!noInteraction) {
		await interaction.editReply({
			content: `Successfully updated visibility for \`#${
				(channel as CourseChannel).name
			}\``,
		});
	}
	return;
};
