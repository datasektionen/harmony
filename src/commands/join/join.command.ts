import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { JoinVariables } from "./join.variables";

export const joinCommand = new SlashCommandBuilder()
	.setName(CommandNames.JOIN)
	.setDescription("Join a course channel");

joinCommand.addStringOption((option) =>
	option.setName(JoinVariables.COURSE_CODE)
	.setDescription("A valid KTH course code (e.g. DA2370, DA150X). It is case-insensitive.")
	.setRequired(true)
)
