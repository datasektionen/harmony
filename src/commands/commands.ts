import { coursesCommand } from "./courses/courses.command";
import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { periodCommand } from "./period/period.command";
import { verifyCommand } from "./verify/verify.command";
import { buttonsCommand } from "./buttons/buttons.command";

export const officialBotCommands = [
	coursesCommand,
	joinCommand,
	leaveCommand,
	verifyCommand,
	periodCommand,
	buttonsCommand,
];
export const lightBotCommands = [verifyCommand];
