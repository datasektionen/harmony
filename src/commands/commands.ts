import { communityCommand } from "./community/community.command";
import { coursesCommand } from "./courses/courses.command";
import { joinCommand } from "./join/join.command";
import { leaveCommand } from "./leave/leave.command";
import { periodCommand } from "./period/period.command";
import { buttonsCommand } from "./buttons/buttons.command";
import { createVerifyCommand } from "./verify/verify.command";
import { translateMsgCommand } from "./translate/translateMsg.command";
import { clubCommand } from "./club/club.command";
import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

type ApplicationCommandBuilder =
	| SlashCommandBuilder
	| ContextMenuCommandBuilder;

export const getOfficialBotCommands = async (): Promise<ApplicationCommandBuilder[]> => [
	coursesCommand,
	joinCommand,
	leaveCommand,
	await createVerifyCommand(),
	periodCommand,
	buttonsCommand,
	communityCommand,
	translateMsgCommand,
	clubCommand,
];

export const getLightBotCommands = async (): Promise<ApplicationCommandBuilder[]> => [
	await createVerifyCommand(true),
	translateMsgCommand,
];
