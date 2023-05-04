import { JoinVariables } from "./join.variables";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import {
	CourseChannel,
	handleChannel,
	handleChannelAlias,
} from "../../shared/utils/channel-utils";
import { AliasName } from "../../shared/alias-mappings";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { User } from "discord.js";
import { GuildButtonOrCommandInteraction } from "../../shared/types/GuildButtonOrCommandInteraction";

export const handleJoin = async (
	interaction: GuildChatInputCommandInteraction
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

export const joinChannel = async (
	channel: CourseChannel,
	interaction: GuildButtonOrCommandInteraction,
	user?: User
): Promise<void> => {
	await channel.permissionOverwrites.create(user ?? interaction.user, {
		ViewChannel: true,
	});
	// Code to auto opt-in in the general discussion channel in forums.
	// Temporarily inactivated due to a message being sent for everyone that joins.
	// For more context: https://github.com/discord/discord-api-docs/discussions/5038
	// To activate: Add an import from discord.js for { ForumChannel }
	/* if (channel instanceof ForumChannel) {
		const thread = channel.threads.cache.find(
			(thread) => thread.name === "⌠💬⌡ General Chat"
		);
		await thread?.members.add(interaction.user);
	} */
};
