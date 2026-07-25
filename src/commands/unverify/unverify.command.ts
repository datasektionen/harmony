import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { UnverifyVariables } from "./unverify.variables";

export const unverifyCommand = new SlashCommandBuilder()
	.setName("unverify")
	.setDescription("Try to remove a user's verification from all servers with this bot and HarmonyDB (only on main).")
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

unverifyCommand.addUserOption((option) =>
	option
		.setName(UnverifyVariables.USER)
		.setDescription("A valid user or user ID.")
		.setRequired(true)
);
