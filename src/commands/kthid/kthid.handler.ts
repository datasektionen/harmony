import { MessageFlags } from "discord.js";
import { getKthIdByUserId, getKthIdByNolleId } from "../../db/db";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { KthIdVariables } from "./kthid.variables";

export const handleKthId = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const user = options.getUser(KthIdVariables.USER, true);
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	// The ?? is the "nullish coalescing" operator.
	// kthId will be set to the value of getKthIdByUserId in all cases except when
	// it returns null, in that case kthId will take the value of getKthIdByNolleId.
	// This ensures that the command works on both regular users and on n0llan.
	const kthId =
		(await getKthIdByUserId(user.id)) ?? (await getKthIdByNolleId(user.id));
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
