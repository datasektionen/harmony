import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
//import { CoursesVariables } from "./courses.variables";

export const coursesCommand = new SlashCommandBuilder()
	.setName(CommandNames.COURSES)
	.setDescription("list all joinable courses");
