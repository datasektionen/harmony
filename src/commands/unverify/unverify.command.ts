import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { UnverifyVariables } from "./unverify.variables";

export const unverifyCommand = new SlashCommandBuilder()
	.setName("unverify")
	.setDescription(
		"(Attempt to) Remove a user's verification from all servers with this bot and Harmony's database."
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

unverifyCommand.addUserOption((option) =>
	option
		.setName(UnverifyVariables.USER)
		.setDescription("A valid user or user ID.")
		.setRequired(true)
);

export const unverifyLightCommand = new SlashCommandBuilder()
	.setName("unverify-light")
	.setDescription(
		"(Attempt to) Remove a user's verification from all servers with this bot."
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

unverifyLightCommand.addUserOption((option) =>
	option
		.setName(UnverifyVariables.USER)
		.setDescription("A valid user or user ID.")
		.setRequired(true)
);
