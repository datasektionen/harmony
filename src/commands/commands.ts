import { addCommand } from "./add/add.command";
import { messageCommand } from "./message/message.command";
import { pingCommand } from "./ping/ping.command";
import { verifyCommand } from "./verify/verify.command";
//import { kickCommand } from "./kick/kick.command";

export const commands = [
	addCommand,
	pingCommand,
	/* kickCommand, */ messageCommand,
	verifyCommand,
];
