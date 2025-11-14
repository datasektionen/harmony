import { ModalBuilder, TextInputStyle } from "discord.js";
import { GuildButtonInteraction } from "../../../../shared/types/GuildButtonInteraction";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { isDarkmode } from "../../../../shared/utils/darkmode";
import {
	generateButtons,
	VERIFY_BUTTON_CUSTOM_IDS,
	VERIFY_BUTTON_LABELS,
	VerifyButtonCustomIds,
	VerifyModalCustomIds,
} from "../util";
import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";

export async function handleButtonsVerify(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const mottagning = await isDarkmode();
	const labels = VERIFY_BUTTON_LABELS;

	// Remove nØllan.
	if (!mottagning) {
		labels.pop();
	}

	await generateButtons(interaction, labels, 2, VERIFY_BUTTON_CUSTOM_IDS);
}

export async function handleVerifyButtonInteraction(
	interaction: GuildButtonInteraction
): Promise<void> {
	const mottagning = await isDarkmode();

	// This will never fail.
	const buttonName = interaction.customId as VerifyButtonCustomIds;

	const modal = new ModalBuilder();

	switch (buttonName) {
		case VerifyButtonCustomIds.BEGIN: {
			modal
				.setCustomId(VerifyModalCustomIds.BEGIN)
				.setTitle("Begin Verification");

			const emailInput = new TextInputBuilder()
				.setCustomId("beginVerifyEmail")
				.setLabel("Enter your KTH email address")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const actionRow =
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					emailInput
				);

			modal.addComponents(actionRow);

			if (mottagning) {
				const codeInput = new TextInputBuilder()
					.setCustomId("beginVerifyCode")
					.setLabel("Enter a valid verification code")
					.setStyle(TextInputStyle.Short)
					.setRequired(false);

				const actionRow =
					new ActionRowBuilder<TextInputBuilder>().addComponents(
						codeInput
					);

				modal.addComponents(actionRow);
			}

			break;
		}
		case VerifyButtonCustomIds.NOLLAN: {
			modal
				.setCustomId(VerifyModalCustomIds.NOLLAN)
				.setTitle("nØllan...");

			const emailInput = new TextInputBuilder()
				.setCustomId("verifyNollanEmail")
				.setLabel("Vad är din KTH-mejladress?")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const actionRow1 =
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					emailInput
				);

			modal.addComponents(actionRow1);

			const nollekodInput = new TextInputBuilder()
				.setCustomId("verifyNollanNollekod")
				.setLabel("Vad är koden du har fått från din Dadda?")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const actionRow2 =
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					nollekodInput
				);

			modal.addComponents(actionRow2);

			break;
		}
		case VerifyButtonCustomIds.SUBMIT: {
			modal
				.setCustomId(VerifyModalCustomIds.SUBMIT)
				.setTitle("Submit Verification Code");

			const verificationCodeInput = new TextInputBuilder()
				.setCustomId("verifySubmitCode")
				.setLabel("Enter your verification code")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const actionRow =
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					verificationCodeInput
				);

			modal.addComponents(actionRow);

			break;
		}
	}

	await interaction.showModal(modal);
}
