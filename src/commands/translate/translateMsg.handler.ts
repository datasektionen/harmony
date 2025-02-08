import { EmbedBuilder, MessageContextMenuCommandInteraction, MessageFlags } from "discord.js";
import {
	isTranslationAvailable,
	translateText,
} from "../../shared/utils/translator";

export const handleTranslateMsg = async (
	interaction: MessageContextMenuCommandInteraction
): Promise<void> => {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	if (!isTranslationAvailable()) {
		await interaction.editReply(
			"Translation features are not currently available."
		);
		return;
	}

	try {
		const result = await translateText(interaction.targetMessage.content);
		if (result === undefined) {
			throw Error("No translation");
		}

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setAuthor({
						name:
							interaction.targetMessage.member?.nickname ||
							interaction.targetMessage.author.username,
						iconURL:
							interaction.targetMessage.member?.displayAvatarURL() ||
							interaction.targetMessage.author.displayAvatarURL() ||
							undefined,
					})
					.setTitle("Translated Message")
					.setURL(interaction.targetMessage.url)
					.setDescription(result)
					.setColor("Blue"),
			],
		});
	} catch (e) {
		console.warn(e);
		await interaction.editReply(
			"Something went wrong and therefore no translation is available."
		);
	}
};
