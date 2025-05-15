import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands.names";

export const updateDfunktCommand = new SlashCommandBuilder()
	.setName(CommandNames.UPDATE_DFUNKT)
	.setDescription("Start the dfunkt role update routine manually.");
updateDfunktCommand.setDefaultMemberPermissions(
	PermissionFlagsBits.ManageGuild
);
