import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../command.names";

export const kickCommand = new SlashCommandBuilder()
	.setName(CommandNames.KICK)
	.setDescription("Kick all members of a specific role from the server");

kickCommand
	.addRoleOption((option) =>
		option
			.setName("role")
			.setDescription("Specify what role to kick")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option.setName("message").setDescription("Specify a reason for the kick")
	)
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
