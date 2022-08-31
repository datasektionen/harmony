import { addCommand } from "./add/add.command";
import { joinCommand } from "./join/join.command";
import { pingCommand } from "./ping/ping.command";
import { verifyCommand } from "./verify/verify.command";
//import { kickCommand } from "./kick/kick.command";

export const commands = [
	addCommand,
	pingCommand,
	/* kickCommand, */ verifyCommand,
	joinCommand
];
