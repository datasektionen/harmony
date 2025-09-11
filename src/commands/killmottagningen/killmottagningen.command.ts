import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";

export const killMottagningenCommand = new SlashCommandBuilder()
	.setName(CommandNames.KILLMOTTAGNINGEN)
	.setDescription(
		"DESTRUCTIVE: End mottagningen in the server by removing and reconfiguring channels and roles."
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
