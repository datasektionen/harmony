import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import {
	handleCourseCode,
	leaveChannel,
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
