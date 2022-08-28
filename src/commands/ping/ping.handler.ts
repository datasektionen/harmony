import { ChatInputCommandInteraction } from "discord.js";

export const handlePing = async (
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	await interaction.reply({
		content: "pong",
		ephemeral: true,
	});
	return;
};
