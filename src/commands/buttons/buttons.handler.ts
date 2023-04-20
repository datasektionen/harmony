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
	// Change the style of the button component,
	// that triggered this interaction
	interaction.component.setStyle("DANGER");

	// Respond to the interaction,
	// and send updated components to the Discord API
	interaction.update({
		components: interaction.message.components,
	});

	// Respond to the interaction,
	// and send updated component to the Discord API
	interaction.update({
		components: [new MessageActionRow().addComponents(interaction.component)],
	});
	await interaction.reply({ ephemeral: true, content: "Hej Herman :)" });
};
