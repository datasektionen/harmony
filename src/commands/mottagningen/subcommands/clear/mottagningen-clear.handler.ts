import { clearNollan } from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export async function handleMottagningenClear(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	await clearNollan();
	interaction.editReply("Cleared 'nollan' database table");
}
