import { ChatInputCommandInteraction } from "discord.js";

export const handleAdd = async (interaction: ChatInputCommandInteraction) => {
	const { options } = interaction;
	const num1 = options.getNumber("num1", true);
	const num2 = options.getNumber("num2", true);

	await interaction.reply({
		content: `The sum of the two numbers is: ${num1 + num2}`,
		ephemeral: true,
	});
};
