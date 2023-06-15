import { coursesCommand } from "./courses/courses.command";
import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { periodCommand } from "./period/period.command";
import { createVerifyCommand, verifyCommand } from "./verify/verify.command";
import { mottagningsmodeCommand } from "./mottagningsmode/mottagningsmode.command";

export const getOfficialBotCommands = async () => [
	coursesCommand,
	joinCommand,
	leaveCommand,
	await createVerifyCommand(),
	periodCommand,
	mottagningsmodeCommand,
];
export const getLightBotCommands = async () => [await createVerifyCommand(true)];
