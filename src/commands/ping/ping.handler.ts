import { ChatInputCommandInteraction } from "discord.js";

export const handlePing = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		content: "pong",
		ephemeral: true,
	});
};
