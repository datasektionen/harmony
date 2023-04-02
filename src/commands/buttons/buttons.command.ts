import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";

export const buttonsCommand = new SlashCommandBuilder()
	.setName(CommandNames.BUTTONS)
	.setDescription("Generate buttons");
