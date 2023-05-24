import { AliasName } from "../../shared/alias-mappings";
import { GuildButtonOrCommandInteraction } from "../../shared/types/GuildButtonOrCommandInteraction";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import {
	CourseChannel,
	handleChannel,
	handleChannelAlias,
} from "../../shared/utils/channel-utils";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import { LeaveVariables } from "./leave.variables";

export const handleLeave = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const courseCode = options
		.getString(LeaveVariables.COURSE_CODE, true)
		.trim()
		.toLowerCase();
	if (aliasExists(courseCode as AliasName)) {
		return await handleChannelAlias(courseCode, interaction, leaveChannel);
	}
	return await handleChannel(courseCode, interaction, leaveChannel);
};

export const leaveChannel = async (
	channel: CourseChannel,
	interaction: GuildButtonOrCommandInteraction
): Promise<void> => {
	await channel.permissionOverwrites.create(interaction.user, {
		ViewChannel: false,
	});
};
