import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { GuildButtonInteraction } from "../../shared/types/GuildButtonInteraction";
import { joinChannel } from "../join/join.handler";
import { leaveChannel } from "../leave/leave.handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import { AliasName } from "../../shared/alias-mappings";
import { ButtonAliases } from "./buttons.properties";
import { aliasExists } from "../../shared/utils/read-alias-mappings";
import {
	handleChannel,
	handleChannelAlias,
	isMemberOfAlias,
} from "../../shared/utils/channel-utils";

// Will be moved to the buttons-courses subcommand.
// Basic logic identical to old code.
export async function handleButtons(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const labels = ButtonAliases.map((alias, index) => {

		// Special formatting for CS and ML master aliases.
		if (index == 3 || index == 4) {
			return alias.charAt(0).toUpperCase() + alias.charAt(1).toUpperCase() + alias.slice(2);
		} else {
			return alias.charAt(0).toUpperCase() + alias.slice(1);
		}
	});
	
	await generateButtons(interaction, labels, 3, ButtonAliases);
}

export async function handleButtonInteraction(
	interaction: GuildButtonInteraction
): Promise<void> {
	const courseCode = interaction.customId;
	const alias = courseCode as AliasName;
	if (aliasExists(alias)) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const joining = !(await isMemberOfAlias(
			interaction.guild,
			interaction.user.id,
			alias
		));
		const action = joining ? joinChannel : leaveChannel;
		const actionVerb = joining ? "joined" : "left";
		const updateCount = await handleChannelAlias(
			interaction.guild,
			interaction.user,
			alias,
			action
		);

		await interaction.editReply({
			content: `Successfully ${actionVerb} \`${alias}\`! (${updateCount}) channels updated`,
		});
	} else {
		await handleChannel(courseCode, interaction, joinChannel);
	}
};

async function generateButtons(
	interaction: GuildChatInputCommandInteraction,
	labels: string[],
	rowLength: Number,
	customIds?: string[]
): Promise<void> {
	if (!interaction.isChatInputCommand()) return;

	const buttons = createButtonsFromLabels(labels, rowLength, customIds);

	// Old code broke due to lack of a check for whether or not
	// channel is sendable.
	// await interaction.channel?.send({ components: buttons });
	if (interaction.channel?.isSendable()) {
		await interaction.channel?.send({ components: buttons });
	}
}

// labels.length must be equal to customIds.length for correct
// behaviour, i.e. each button to be assigned the expected customId.
function createButtonsFromLabels(
	labels: string[],
	rowLength: Number,
	customIds?: string[]
): ActionRowBuilder<ButtonBuilder>[] {
	let rows = [];
	let row = new ActionRowBuilder<ButtonBuilder>();

	labels.forEach((value, index) => {
		row.addComponents(
			new ButtonBuilder()
				.setCustomId(typeof customIds === "undefined" ? value : customIds[index])
				.setLabel(value)
				.setStyle(ButtonStyle.Primary)
		)

		if (row.components.length == rowLength) {
			rows.push(row);
			row = new ActionRowBuilder<ButtonBuilder>();
		}
	});

	if (row.components.length > 0) {
		rows.push(row);
	}

	return rows;
}
