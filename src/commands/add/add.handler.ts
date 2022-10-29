import { ChatInputCommandInteraction } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { AddVariables } from "./add.variables";

export const handleAdd = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const num1 = options.getNumber(AddVariables.NUM1, true);
	const num2 = options.getNumber(AddVariables.NUM2, true);

	await interaction.reply({
		content: `The sum of the two numbers is: ${num1 + num2}`,
		ephemeral: true,
	});
	return;
};
