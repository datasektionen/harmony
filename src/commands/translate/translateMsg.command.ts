import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";

export const translateMsgCommand = new ContextMenuCommandBuilder()
	.setName(CommandNames.TRANSLATE_MSG)
	.setType(ApplicationCommandType.Message);
