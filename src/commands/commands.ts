import { coursesCommand } from "./courses/courses.command";
import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { periodCommand } from "./period/period.command";
import { createVerifyCommand } from "./verify/verify.command";
import { mottagningsmodeCommand } from "./mottagningsmode/mottagningsmode.command";
import { SlashCommandBuilder } from "discord.js";

export const getOfficialBotCommands = async (): Promise<SlashCommandBuilder[]> => [
	coursesCommand,
	joinCommand,
	leaveCommand,
	await createVerifyCommand(),
	periodCommand,
	mottagningsmodeCommand,
];
export const getLightBotCommands = async (): Promise<SlashCommandBuilder[]> => [
	await createVerifyCommand(true)
];
