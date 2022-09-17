import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { AliasName } from "../../shared/alias-mappings";
import {
	handleChannel,
	handleChannelAlias,
} from "../../shared/utils/channel-utils";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import { LeaveVariables } from "./leave.variables";

export const handleLeave = async (
	interaction: ChatInputCommandInteraction
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

const leaveChannel = async (
	channel: TextChannel,
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	await channel.permissionOverwrites.create(interaction.user, {
		ViewChannel: false,
	});
};
