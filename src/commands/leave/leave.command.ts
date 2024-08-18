import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { LeaveVariables } from "./leave.variables";

export const leaveCommand = new SlashCommandBuilder()
	.setName(CommandNames.LEAVE)
	.setDescription("Leave a course channel");

leaveCommand.addStringOption((option) =>
	option
		.setName(LeaveVariables.COURSE_CODE)
		.setDescription(
			"A valid KTH course code (e.g. DA2370, DA150X). It is case-insensitive."
		)
		.setRequired(true)
);
