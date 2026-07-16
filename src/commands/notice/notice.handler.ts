import { CommandNotFoundError } from "../../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { NoticeSubcommandNames } from "./notice-subcommands.names";
import { handleNoticeEdit } from "./subcommands/edit/notice-edit.handler";
import { handleNoticeSend } from "./subcommands/send/notice-send.handler";
import { handleNoticeSetChannel } from "./subcommands/set-channel/notice-set-channel.handler";

export async function handleNotice(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);
	await interaction.deferReply();

	switch (subcommandName) {
		case NoticeSubcommandNames.SEND:
			return await handleNoticeSend(interaction);
		case NoticeSubcommandNames.SET_CHANNEL:
			return await handleNoticeSetChannel(interaction);
		case NoticeSubcommandNames.EDIT:
			return await handleNoticeEdit(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
}
