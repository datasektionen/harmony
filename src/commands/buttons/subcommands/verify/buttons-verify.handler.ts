import { GuildButtonInteraction } from "../../../../shared/types/GuildButtonInteraction";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { isDarkmode } from "../../../../shared/utils/darkmode";
import { generateButtons, VERIFY_BUTTON_LABELS, VerifyButtonNames } from "../util";

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

    switch (buttonName) {
        
    }
}