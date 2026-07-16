import {
	ChannelType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { CommandNames } from "../commands.names";
import { NoticeSubcommandNames } from "./notice-subcommands.names";
import { NoticeSendVariables } from "./subcommands/send/notice-send.variables";
import { NoticeSetChannelVariables } from "./subcommands/set-channel/notice-set-channel.variables";
import { NoticeEditVariables } from "./subcommands/edit/notice-edit.variables";

export const noticeCommand = new SlashCommandBuilder()
	.setName(CommandNames.NOTICE)
	.setDescription("Notice a user")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

noticeCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(NoticeSubcommandNames.SEND)
		.setDescription("Send a notice to a user")
		.addUserOption((option) =>
			option
				.setName(NoticeSendVariables.USER)
				.setDescription("The user to send a notice to")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName(NoticeSendVariables.MESSAGE)
				.setDescription("The message of the notice")
				.setRequired(true)
		)
);

noticeCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(NoticeSubcommandNames.SET_CHANNEL)
		.setDescription(
			"Set which channel notices should be sent in (admin-only)"
		)
		.addChannelOption((option) =>
			option
				.setName(NoticeSetChannelVariables.CHANNEL_ID)
				.setDescription(
					"The channel where the notices of the server should be sent"
				)
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		)
);

noticeCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(NoticeSubcommandNames.EDIT)
		.setDescription(
			"Edit a previously sent notice (good for editing typos)"
		)
		.addChannelOption((option) =>
			option
				.setName(NoticeEditVariables.NOTICE_THREAD)
				.setDescription(
					"The thread of the notice that should be edited"
				)
				.addChannelTypes(ChannelType.PrivateThread)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName(NoticeEditVariables.NEW_MESSAGE)
				.setDescription("The updated message of the notice")
				.setRequired(true)
		)
);
