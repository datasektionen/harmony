import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { AddVariables } from "./add.variables";

export const addCommand = new SlashCommandBuilder()
	.setName(CommandNames.ADD)
	.setDescription("add two numbers");

addCommand.addNumberOption((option) =>
	option
		.setName(AddVariables.NUM1)
		.setDescription("first term to add")
		.setRequired(true)
);

addCommand.addNumberOption((option) =>
	option
		.setName(AddVariables.NUM2)
		.setDescription("second term to add")
		.setRequired(true)
);
