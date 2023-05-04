import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { GuildButtonInteraction } from "../../shared/types/GuildButtonInteraction";
import { joinChannel } from "../join/join.handler";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";

import { AliasName } from "../../shared/alias-mappings";
import { ButtonAliases } from "./buttons.properties";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import { handleChannel, handleChannelAlias } from "../../shared/utils/channel-utils";

export const generateButtons = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	if (!interaction.isChatInputCommand()) return;

	const buttons = createAliasButtons(ButtonAliases);

	await interaction.reply({
		ephemeral: true,
		components: buttons,
	});
};

export const handleButtonInteraction = async (
	interaction: GuildButtonInteraction,
): Promise<void> => {
	// Respond to the interaction,
	// TODO: This message should inform the user about whether they're joining or leaving

	const courseCode = interaction.customId;

	if (aliasExists(courseCode as AliasName)) {
		return await handleChannelAlias(courseCode, interaction, joinChannel);
	}
	return await handleChannel(courseCode, interaction, joinChannel);

	//await interaction.reply({ ephemeral: true, content: `${interaction.customId}` });
};

function createAliasButtons(aliases: AliasName[]): ActionRowBuilder<ButtonBuilder>[] {
	const BUTTONS_PER_ROW = 3;
	const rows = []
	let row = new ActionRowBuilder<ButtonBuilder>();
	for (const [, alias] of Object.entries(aliases)) {		
		const buttonLabel = alias.charAt(0).toUpperCase() + alias.slice(1);
		row.addComponents(
			new ButtonBuilder()
				.setCustomId(alias)
				.setLabel(buttonLabel)
				.setStyle(ButtonStyle.Primary)
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
