import { ChatInputCommandInteraction, ForumChannel } from "discord.js";
import { JoinVariables } from "./join.variables";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import {
	CourseChannel,
	handleChannel,
	handleChannelAlias,
} from "../../shared/utils/channel-utils";
import { AliasName } from "../../shared/alias-mappings";

export const handleJoin = async (
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const courseCode = options
		.getString(JoinVariables.COURSE_CODE, true)
		.trim()
		.toLowerCase();

	if (aliasExists(courseCode as AliasName)) {
		return await handleChannelAlias(courseCode, interaction, joinChannel);
	}
	return await handleChannel(courseCode, interaction, joinChannel);
};

const joinChannel = async (
	channel: CourseChannel,
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	await channel.permissionOverwrites.create(interaction.user, {
		ViewChannel: true,
	});
	if (channel instanceof ForumChannel) {
		const thread = channel.threads.cache.find(
			(thread) => thread.name === "⌠💬⌡ General Chat"
		);
		await thread?.members.add(interaction.user);
	}
};
