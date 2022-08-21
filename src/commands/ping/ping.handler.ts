import { CommandInteraction } from "discord.js";

export const handlePing = (interaction: CommandInteraction) => {
	interaction.reply({
		content: "pong",
		ephemeral: true,
	});
};
