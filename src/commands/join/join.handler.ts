import {
	ChatInputCommandInteraction,
	ForumChannel,
	TextChannel,
} from "discord.js";
import { JoinVariables } from "./join.variables";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import {
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
	channel: ForumChannel | TextChannel,
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	await channel.permissionOverwrites.create(interaction.user, {
		ViewChannel: true,
	});
};
