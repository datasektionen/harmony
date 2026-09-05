import { PermissionFlagsBits } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { NoticeSetChannelVariables } from "./notice-set-channel.variables";
import { setNoticeChannel } from "../../../../db/db";

export const handleNoticeSetChannel = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	/* 
    Only administrators should be allowed to set the notice channel.
    Since subcommands cannot have their own default permissions, 
    the check has to be done manually
    */
	if (
		!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
	) {
		await interaction.editReply({
			content: "You must be an administrator to use this command!",
		});
		return;
	} else {
		// Here goes the actual logic of the command
		const { options } = interaction;
		const channel = options.getChannel(
			NoticeSetChannelVariables.CHANNEL_ID,
			true
		);

		await setNoticeChannel(interaction.guildId!, channel.id);

		await interaction.editReply({
			content: `Notice channel set to ${channel.toString()}`,
		});
	}
};
