import { ModalBuilder, TextInputStyle } from "discord.js";
import { GuildButtonInteraction } from "../../../../shared/types/GuildButtonInteraction";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { isDarkmode } from "../../../../shared/utils/darkmode";
import { generateButtons, VERIFY_BUTTON_LABELS, VerifyButtonNames, VerifyModalCustomIds } from "../util";
import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";

export async function handleButtonsVerify(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const mottagning = await isDarkmode();

    let labels: string[];

    if (mottagning) {
        labels = VERIFY_BUTTON_LABELS.map((label, index) => {
            if (index == 2) {
                return "n" + "Ø" + label.slice(2);
            } else {
                return label.charAt(0).toUpperCase() + label.slice(1);
            }
        })
    } else {
        labels = VERIFY_BUTTON_LABELS.map((label) => {
            return label.charAt(0).toUpperCase() + label.slice(1);
        })

        // Remove nØllan.
        labels.pop();
    }

    await generateButtons(interaction, labels, 2, VERIFY_BUTTON_LABELS);
};

export async function handleVerifyButtonInteraction(
    interaction: GuildButtonInteraction
): Promise<void> {

    const mottagning = await isDarkmode();

    // This will never fail.
    const buttonName = interaction.customId as VerifyButtonNames;

    const modal = new ModalBuilder();

    switch (buttonName) {
        case VerifyButtonNames.BEGIN: {
            modal
                .setCustomId(VerifyModalCustomIds.BEGIN)
                .setTitle("Begin Verification");

            const emailInput = new TextInputBuilder()
                .setCustomId("beginVerifyEmail")
                .setLabel("Enter your KTH email address")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(emailInput);

            modal.addComponents(actionRow);

            if (mottagning) {
                const codeInput = new TextInputBuilder()
                    .setCustomId("beginVerifyCode")
                    .setLabel("Enter any special codes you may have received")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput);

                modal.addComponents(actionRow);
            }

            break;
        }
        case VerifyButtonNames.NOLLAN: {
            modal
                .setCustomId(VerifyModalCustomIds.NOLLAN)
                .setTitle("nØllan...");

            const nollekodInput = new TextInputBuilder()
                .setCustomId("VerifyNollanNollekod")
                .setLabel("Vad är din nØllekod, nØllan?")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nollekodInput);

            modal.addComponents(actionRow);

            break;
        }
        case VerifyButtonNames.SUBMIT: {
            modal
                .setCustomId(VerifyModalCustomIds.SUBMIT)
                .setTitle("Submit Verification Code");

            const verificationCodeInput = new TextInputBuilder()
                .setCustomId("verifySubmitCode")
                .setLabel("Enter your verification code")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(verificationCodeInput);

            modal.addComponents(actionRow);

            break;
        }
    }

    await interaction.showModal(modal);
}