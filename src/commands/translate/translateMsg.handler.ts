import { EmbedBuilder, MessageContextMenuCommandInteraction } from "discord.js";
import { translator } from "../../shared/utils/translator";

export const handleTranslateMsg = async (
	interaction: MessageContextMenuCommandInteraction
): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });

	if (translator === undefined) {
		await interaction.editReply(
			"Translation features are not currently available."
		);
		return;
	}

	try {
		const result = await translator.translateText(
			interaction.targetMessage.content,
			"sv",
			"en-US",
			{
				formality: "prefer_less",
			}
		);

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
					.setDescription(result.text)
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
