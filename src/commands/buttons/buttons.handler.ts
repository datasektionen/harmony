import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import {
	ActionRowBuilder,
	ActionRowData,
	AnyComponentBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";

export const generateButtons = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "button") {
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("primary")
				.setLabel("Click me!")
				.setStyle(ButtonStyle.Primary)
		);

		await interaction.reply({
			content: "I think you should,",
			ephemeral: true,
			components: [row],
		});
	}
};
