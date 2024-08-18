import { User } from "discord.js";
import { AliasName } from "../../shared/alias-mappings";
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
	await interaction.deferReply({ ephemeral: true });

	const { options } = interaction;
	const courseCode = options
		.getString(LeaveVariables.COURSE_CODE, true)
		.trim()
		.toLowerCase();
	if (aliasExists(courseCode as AliasName)) {
		const updateCount = await handleChannelAlias(
			interaction.guild,
			interaction.user,
			courseCode,
			leaveChannel
		);
		await interaction.editReply({
			content: `Successfully left \`${courseCode}\`! (${updateCount}) channels updated`,
		});
		return;
	}
	return await handleChannel(courseCode, interaction, leaveChannel);
};

export const leaveChannel = async (
	channel: CourseChannel,
	user: User
): Promise<void> => {
	await channel.permissionOverwrites.delete(user);
};
