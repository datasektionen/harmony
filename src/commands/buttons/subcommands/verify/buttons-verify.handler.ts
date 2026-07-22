import { CheckboxGroupBuilder, ModalBuilder, TextInputStyle } from "discord.js";
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
import { LabelBuilder } from "discord.js";

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
				.setPlaceholder("turetek@kth.se")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const emailLabel = new LabelBuilder()
				.setLabel("Enter your KTH email address")
				.setDescription("An @kth.se email address, not e.g. @ug.kth.se.")
				.setTextInputComponent(emailInput);

			modal.addLabelComponents(emailLabel)

			if (mottagning) {
				const codeInput = new TextInputBuilder()
					.setCustomId("beginVerifyCode")
					.setPlaceholder("1234abcdef")
					.setStyle(TextInputStyle.Short)
					.setRequired(false);

				const codeLabel = new LabelBuilder()
					.setLabel("Enter a valid verification code")
					.setDescription("You may have received one in your inbox.")
					.setTextInputComponent(codeInput);

				modal.addLabelComponents(codeLabel);
			}

			break;
		}
		case VerifyButtonCustomIds.NOLLAN: {
			modal
				.setCustomId(VerifyModalCustomIds.NOLLAN)
				.setTitle("nØllan...");

			const emailInput = new TextInputBuilder()
				.setCustomId("verifyNollanEmail")
				.setPlaceholder("turetek@kth.se")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const emailLabel = new LabelBuilder()
				.setLabel("Vad är din KTH-mejladress?")
				.setDescription("Använd din @kth.se-adress, inte @ug.kth.se!")
				.setTextInputComponent(emailInput);

			modal.addLabelComponents(emailLabel);

			const nollekodInput = new TextInputBuilder()
				.setCustomId("verifyNollanNollekod")
				.setPlaceholder("1234abcdef")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);
			
			const nollekodLabel = new LabelBuilder()
				.setLabel("Vad är koden du har fått från din Dadda?")
				.setDescription("Har du glömt bort koden? Kontakta din Dadda!")
				.setTextInputComponent(nollekodInput);

			modal.addLabelComponents(nollekodLabel);

			break;
		}
		case VerifyButtonCustomIds.SUBMIT: {
			modal
				.setCustomId(VerifyModalCustomIds.SUBMIT)
				.setTitle("Submit Verification Code");

			const verificationCodeInput = new TextInputBuilder()
				.setCustomId("verifySubmitCode")
				.setPlaceholder("1234abcdef")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const verificationCodeLabel = new LabelBuilder()
				.setLabel("Enter your verification code")
				.setDescription("You will receive one in your KTH inbox shortly.")
				.setTextInputComponent(verificationCodeInput);

			modal.addLabelComponents(verificationCodeLabel);

			break;
		}
	}

	await interaction.showModal(modal);
}
