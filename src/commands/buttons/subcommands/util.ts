import { GuildChatInputCommandInteraction } from "../../../shared/types/GuildChatInputCommandType";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { AliasName } from "../../../shared/alias-mappings";

// Labels for course buttons
//
// - Used as button labels (first letter capitalised for all except for CS- and ML-master).
// - Used as button id (lowercase).
export const COURSE_BUTTON_LABELS = [
	AliasName.YEAR1,
	AliasName.YEAR2,
	AliasName.YEAR3,
	AliasName.CS_MASTER,
	AliasName.ML_MASTER,
	AliasName.ALL_ELECTIVES,
];

// Labels for verify buttons
//
// - Used as button labels (first letter capitalised).
// - Used as button id (lowercase).
export enum VerifyButtonNames {
	BEGIN = "begin",
	NOLLAN = "nollan",
	SUBMIT = "submit",
}

export const VERIFY_BUTTON_LABELS = [
	VerifyButtonNames.BEGIN,
	VerifyButtonNames.SUBMIT,
	VerifyButtonNames.NOLLAN,
];

export enum VerifyModalCustomIds {
	BEGIN = "beginVerify",
	NOLLAN = "verifyNollan",
	SUBMIT = "verifySubmit",
}

export const VERIFY_MODAL_CUSTOM_IDS = [
	VerifyModalCustomIds.BEGIN,
	VerifyModalCustomIds.NOLLAN,
	VerifyModalCustomIds.SUBMIT,
];

export async function generateButtons(
	interaction: GuildChatInputCommandInteraction,
	labels: string[],
	rowLength: number,
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
	rowLength: number,
	customIds?: string[]
): ActionRowBuilder<ButtonBuilder>[] {
	const rows = [];
	let row = new ActionRowBuilder<ButtonBuilder>();

	labels.forEach((value, index) => {
		row.addComponents(
			new ButtonBuilder()
				.setCustomId(
					typeof customIds === "undefined" ? value : customIds[index]
				)
				.setLabel(value)
				.setStyle(ButtonStyle.Primary)
		);

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
