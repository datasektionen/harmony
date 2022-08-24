import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../command.names";

export const kickCommand = new SlashCommandBuilder()
	.setName(CommandNames.KICK)
	.setDescription("Kick all members of a specific role from the server");

kickCommand.addStringOption((option) =>
	option
		.setName("role")
		.setDescription("Specify what role to kick")
		.setRequired(true)
);
