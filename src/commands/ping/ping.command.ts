import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";

export const pingCommand = new SlashCommandBuilder()
	.setName(CommandNames.PING)
	.setDescription("Test Command: Responds with pong");
