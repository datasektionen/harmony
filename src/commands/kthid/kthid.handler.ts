import { getKthIdByUserId} from "../../db/db";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { KthIdVariables } from "./kthid.variables";

export const handleKthId = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    const { options } = interaction;
    const user = options
        .getString(KthIdVariables.USER, true)
        .replace(/[\D]/g, '');
    const kthId = await getKthIdByUserId(user);
    await interaction.deferReply({ ephemeral: true });
    if (!kthId) {
        await interaction.editReply({
            content: `Found no KTH ID mathing the provided Discord account`,
        });
    } else {
        await interaction.editReply({
            content: `The KTH ID of the provided user is: **${kthId}**`,
        });
    }
}
