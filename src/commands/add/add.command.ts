import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../command.names";

export const addCommand = new SlashCommandBuilder()
	.setName(CommandNames.ADD)
	.setDescription("add two numbers");

addCommand.addNumberOption((option) =>
	option.setName("num1").setDescription("first term to add").setRequired(true)
);

addCommand.addNumberOption((option) =>
	option.setName("num2").setDescription("second term to add").setRequired(true)
);
