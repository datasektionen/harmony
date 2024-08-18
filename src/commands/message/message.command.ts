import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { MessageVariables } from "./message.variables";

export const messageCommand = new SlashCommandBuilder()
	.setName(CommandNames.MESSAGE)
	.setDescription(
		"Direct message all members of a specific role from the server"
	);

messageCommand
	.addRoleOption((option) =>
		option
			.setName(MessageVariables.ROLE)
			.setDescription("Specify what role to message")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName(MessageVariables.MESSAGEID)
			.setDescription("The ID of a message in this channel whose text to send")
			.setRequired(true)
	)
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
