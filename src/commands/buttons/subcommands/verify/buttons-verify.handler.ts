import { ModalBuilder, TextInputStyle } from "discord.js";
import { GuildButtonInteraction } from "../../../../shared/types/GuildButtonInteraction";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { isDarkmode } from "../../../../shared/utils/darkmode";
import { generateButtons, VERIFY_BUTTON_LABELS, VerifyButtonNames } from "../util";
import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";

export async function handleButtonsVerify(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const mottagning = await isDarkmode();

    if (mottagning) {
        const labels = VERIFY_BUTTON_LABELS.map((label, index) => {
            if (index == 2) {
                return "n" + "Ø" + label.slice(2);
            } else {
                return label.charAt(0).toUpperCase() + label.slice(1);
            }
        })
    } else {
        const labels = VERIFY_BUTTON_LABELS.map((label, _) => {
            return label.charAt(0).toUpperCase() + label.slice(1);
        })

        // Remove nØllan.
        labels.pop();

        await generateButtons(interaction, labels, 2, VERIFY_BUTTON_LABELS);
    }
};

export async function handleVerifyButtonInteraction(
    interaction: GuildButtonInteraction
): Promise<void> {

    // This will never fail.
    const buttonName = interaction.customId as VerifyButtonNames;

    const modal = new ModalBuilder();

    switch (buttonName) {
        case VerifyButtonNames.BEGIN: {
            modal
                .setCustomId("beginVerify")
                .setTitle("Begin Verification");

            const emailInput = new TextInputBuilder()
                .setCustomId("beginVerifyEmail")
                .setLabel("Enter your KTH email address")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(emailInput);

            modal.addComponents(actionRow);
        }
        case VerifyButtonNames.NOLLAN: {

        }
        case VerifyButtonNames.SUBMIT: {

        }
    }

    await interaction.showModal(modal);
}