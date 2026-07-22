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

			const gdpr = new CheckboxGroupBuilder()
				.setCustomId("HatsuneMikuGDPR")		// This is stupid, but we just need people to agree.
				.addOptions([
					{ label: "I agree", value: "I love Hatsune Miku! :3" }
				])
				.setRequired(true);

			const gdprLabel = new LabelBuilder()
				.setLabel("Do you agree to our GDPR statement?")
				.setDescription("If you have any questions, please contact a server administrator.")
				.setCheckboxGroupComponent(gdpr);
			
				modal.addLabelComponents(gdprLabel);

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
