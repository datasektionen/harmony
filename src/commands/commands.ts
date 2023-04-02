import { communityCommand } from "./community/community.command";
import { coursesCommand } from "./courses/courses.command";
import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { periodCommand } from "./period/period.command";
import { verifyCommand } from "./verify/verify.command";

export const officialBotCommands = [
	coursesCommand,
	joinCommand,
	leaveCommand,
	verifyCommand,
	periodCommand,
	communityCommand,
];
export const lightBotCommands = [verifyCommand];
