import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { KickCommandNames } from "./kick-command.names";

export const kickCommand = new SlashCommandBuilder()
	.setName(CommandNames.KICK)
	.setDescription("Kick all members of a specific role from the server");

kickCommand
	.addRoleOption((option) =>
		option
			.setName(KickCommandNames.ROLE)
			.setDescription("Specify what role to kick")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName(KickCommandNames.MESSAGE)
			.setDescription("Specify a reason for the kick")
	)
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
