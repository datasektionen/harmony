import { CommandInteraction } from "discord.js";

export const handlePing = async (interaction: CommandInteraction) => {
	await interaction.reply({
		content: "pong",
		ephemeral: true,
	});
};
