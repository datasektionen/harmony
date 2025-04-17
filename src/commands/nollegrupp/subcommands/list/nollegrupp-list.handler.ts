import { formatNollegruppData } from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export async function handleNollegruppList(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const content = await formatNollegruppData()

    await interaction.editReply({
        content: content
    })
}