import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { verifyCommand } from "./verify/verify.command";

export const commands = [
	verifyCommand,
	joinCommand,
	leaveCommand,
];
