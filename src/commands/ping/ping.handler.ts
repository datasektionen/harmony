import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handlePing = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	await interaction.reply({
		content: "pong",
		ephemeral: true,
	});
	return;
};
