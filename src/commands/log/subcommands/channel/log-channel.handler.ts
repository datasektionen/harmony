import { MessageFlags } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { LogVariables } from "../log.variables";
import path from "path";
import fs from "fs";

const relativeLogChannelPath = "../../../../../assets/log_channel.txt"; 

export const handleLogChannel = async (
	interaction: GuildChatInputCommandInteraction,
): Promise<void> => {
	const { options } = interaction;
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	
		const channelParam = options.getChannel(
			LogVariables.CHANNEL,
			true
		);
		const filePath = path.resolve(__dirname, relativeLogChannelPath);
		fs.writeFileSync(filePath, channelParam.id);
	
		await interaction.editReply({
			content: `Channel <#${channelParam.id}> has been set as the log channel.`
		})
	return;
};
