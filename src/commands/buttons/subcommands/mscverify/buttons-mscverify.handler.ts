import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { GuildButtonInteraction } from "../../../../shared/types/GuildButtonInteraction";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { generateButtons, MSCVERIFY_BUTTON_CUSTOM_IDS, MSCVERIFY_BUTTON_LABELS, MScVerifyButtonCustomIds, MScVerifyModalCustomIds } from "../util";

export async function handleButtonsMScVerify(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const labels = MSCVERIFY_BUTTON_LABELS;
    await generateButtons(interaction, labels, 2, MSCVERIFY_BUTTON_CUSTOM_IDS);
}

export async function handleMScVerifyButtonInteraction(
    interaction: GuildButtonInteraction
): Promise<void> {
    // This will never fail.
    const buttonName = interaction.customId as MScVerifyButtonCustomIds;

    const modal = new ModalBuilder();

    switch (buttonName) {
        case MScVerifyButtonCustomIds.BEGIN: {
            modal
                .setCustomId(MScVerifyModalCustomIds.BEGIN)
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

            break;
        }
        case MScVerifyButtonCustomIds.SUBMIT: {
            modal
                .setCustomId(MScVerifyModalCustomIds.SUBMIT)
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
