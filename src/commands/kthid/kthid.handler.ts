import { getKthIdByUserId } from "../../db/db";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { KthIdVariables } from "./kthid.variables";

export const handleKthId = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const user = options.getUser(KthIdVariables.USER, true);
	await interaction.deferReply({ ephemeral: true });
    const kthId = await getKthIdByUserId(user.id);
	if (!kthId) {
		await interaction.editReply({
			content: "Found no KTH ID mathing the provided Discord account",
		});
	} else {
		await interaction.editReply({
			content: `The KTH ID of the provided user is: **${kthId}**`,
		});
	}
};
