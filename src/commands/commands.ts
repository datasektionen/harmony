import { communityCommand } from "./community/community.command";
import { coursesCommand } from "./courses/courses.command";
import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { periodCommand } from "./period/period.command";
import { buttonsCommand } from "./buttons/buttons.command";
import { createVerifyCommand } from "./verify/verify.command";
import { mottagningsmodeCommand } from "./mottagningsmode/mottagningsmode.command";
import { SlashCommandBuilder } from "discord.js";

export const getOfficialBotCommands = (): SlashCommandBuilder[] => [
	coursesCommand,
	joinCommand,
	leaveCommand,
	createVerifyCommand(),
	periodCommand,
	buttonsCommand,
	mottagningsmodeCommand,
	communityCommand,
];

export const getLightBotCommands = (): SlashCommandBuilder[] => [
	createVerifyCommand(true),
];
