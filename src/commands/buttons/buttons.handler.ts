import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { GuildButtonInteraction } from "../../shared/types/GuildButtonInteraction";
import { joinChannel } from "../join/join.handler";
import { leaveChannel } from "../leave/leave.handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { AliasName } from "../../shared/alias-mappings";
import { ButtonAliases } from "./buttons.properties";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import {
	handleChannel,
	handleChannelAlias,
	isMemberOfAlias,
} from "../../shared/utils/channel-utils";

export const handleButtons = async (
	interaction: GuildChatInputCommandInteraction,
): Promise<void> => {
	if (!interaction.isChatInputCommand()) return;

	const buttons = createAliasButtons(ButtonAliases);

	await interaction.channel?.send({ components: buttons });
};

export const handleButtonInteraction = async (
	interaction: GuildButtonInteraction,
): Promise<void> => {
	const courseCode = interaction.customId;
	const alias = courseCode as AliasName;
	if (aliasExists(alias)) {
		await interaction.deferReply({ ephemeral: true });
		const joining = !(await isMemberOfAlias(
			interaction.guild,
			interaction.user.id,
			alias,
		));
		const action = joining ? joinChannel : leaveChannel;
		const actionVerb = joining ? "joined" : "left";
		const updateCount = await handleChannelAlias(
			interaction.guild,
			interaction.user,
			alias,
			action,
		);

		await interaction.editReply({
			content: `Successfully ${actionVerb} \`${alias}\`! (${updateCount}) channels updated`,
		});
	} else {
		await handleChannel(courseCode, interaction, joinChannel);
	}
};

function createAliasButtons(
	aliases: AliasName[],
): ActionRowBuilder<ButtonBuilder>[] {
	const BUTTONS_PER_ROW = 3;
	const rows = [];
	let row = new ActionRowBuilder<ButtonBuilder>();
	for (const [, alias] of Object.entries(aliases)) {
		const buttonLabel = alias.charAt(0).toUpperCase() + alias.slice(1);
		row.addComponents(
			new ButtonBuilder()
				.setCustomId(alias)
				.setLabel(buttonLabel)
				.setStyle(ButtonStyle.Primary),
		);
		if (row.components.length == BUTTONS_PER_ROW) {
			rows.push(row);
			row = new ActionRowBuilder<ButtonBuilder>();
		}
	}
	if (row.components.length > 0) {
		rows.push(row);
	}
	return rows;
}
