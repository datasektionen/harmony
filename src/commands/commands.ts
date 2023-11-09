import { communityCommand } from "./community/community.command";
import { coursesCommand } from "./courses/courses.command";
import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { periodCommand } from "./period/period.command";
import { createVerifyCommand } from "./verify/verify.command";
import { mottagningsmodeCommand } from "./mottagningsmode/mottagningsmode.command";
import { translateMsgCommand } from "./translate/translateMsg.command";
import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

type ApplicationCommandBuilder =
	| SlashCommandBuilder
	| ContextMenuCommandBuilder;

export const getOfficialBotCommands = (): ApplicationCommandBuilder[] => [
	coursesCommand,
	joinCommand,
	leaveCommand,
	createVerifyCommand(),
	periodCommand,
	mottagningsmodeCommand,
	communityCommand,
	translateMsgCommand,
];

export const getLightBotCommands = (): ApplicationCommandBuilder[] => [
	createVerifyCommand(true),
	translateMsgCommand,
];
