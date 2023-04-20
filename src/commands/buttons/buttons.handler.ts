import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
} from "discord.js";

export const generateButtons = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	if (!interaction.isChatInputCommand()) return;

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("SF1688")
			.setLabel("SF1688")
			.setStyle(ButtonStyle.Primary)
	);

	await interaction.reply({
		content: "I think you should,",
		components: [row],
	});
};

export const handleButtonInteraction = async (
	interaction: ButtonInteraction
): Promise<void> => {
	// Respond to the interaction,
	// TODO: This message should inform the user about whether they're joining or leaving
	await interaction.reply({ ephemeral: true, content: "Hej Herman :)" }); 
};
