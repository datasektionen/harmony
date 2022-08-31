import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { MessageVariableNames } from "./message-command.names";

export const messageCommand = new SlashCommandBuilder()
	.setName(CommandNames.MESSAGE)
	.setDescription("Send a message to all members of a specific role");

messageCommand
	.addRoleOption((option) =>
		option
			.setName(MessageVariableNames.ROLE)
			.setDescription("Specify what role to send the message to")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName(MessageVariableNames.MESSAGE)
			.setDescription("Message to send to everyone")
			.setRequired(true)
	)
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
