import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { KthIdVariables } from "./kthid.variables";

export const kthIdCommand = new SlashCommandBuilder()
	.setName(CommandNames.KTHID)
	.setDescription("Get the KTH ID of a user")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

kthIdCommand.addStringOption((option) =>
	option
		.setName(KthIdVariables.USER)
		.setDescription("A valid user or user ID.")
		.setRequired(true)
);
