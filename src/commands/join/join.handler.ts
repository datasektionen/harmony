import { JoinVariables } from "./join.variables";
import {
	CourseChannel,
	handleCourseCode,
	isCourseChannel,
} from "../../shared/utils/channel-utils";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import {
	ApplicationCommandOptionChoiceData,
	AutocompleteInteraction,
	User,
} from "discord.js";
import { validCourseCode } from "../../shared/utils/valid-course-code";

export const handleJoin = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const courseCode = options
		.getString(JoinVariables.COURSE_CODE, true)
		.trim()
		.toLowerCase();
	return await handleCourseCode(courseCode, interaction, joinChannel);
};

export const joinChannel = async (
	channel: CourseChannel,
	user: User
): Promise<void> => {
	await channel.permissionOverwrites.create(user, {
		ViewChannel: true,
	});
};

export const handleJoinAutocomplete = async (
	interaction: AutocompleteInteraction
): Promise<void> => {
	const courseCode = interaction.options
		.getString(JoinVariables.COURSE_CODE, true)
		.trim()
		.toLowerCase();
	if (!interaction.guild) return;
	const choices = interaction.guild.channels.cache.reduce<
		ApplicationCommandOptionChoiceData[]
	>((acc, channel) => {
		if (
			acc.length < 25 &&
			channel.name.startsWith(courseCode) &&
			validCourseCode(channel.name) &&
			isCourseChannel(channel)
		)
			acc.push({ name: channel.name, value: channel.name.split("-")[0] });
		return acc;
	}, []);
	await interaction.respond(choices);
};
