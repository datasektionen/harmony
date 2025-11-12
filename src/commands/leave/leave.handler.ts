import { User } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import {
	CourseChannel,
	handleCourseCode,
} from "../../shared/utils/channel-utils";
import { LeaveVariables } from "./leave.variables";

export const handleLeave = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const courseCode = options
		.getString(LeaveVariables.COURSE_CODE, true)
		.trim()
		.toLowerCase();
	return await handleCourseCode(courseCode, interaction, leaveChannel);
};

export const leaveChannel = async (
	channel: CourseChannel,
	user: User
): Promise<void> => {
	await channel.permissionOverwrites.delete(user);
};
