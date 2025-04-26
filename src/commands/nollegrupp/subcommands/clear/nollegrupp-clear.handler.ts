import { clearNollegrupper } from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export async function handleNollegruppClear(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	await clearNollegrupper();

	interaction.editReply({
		content:
			"Successfully cleared all nØllegrupper. Remember that this breaks verification of nØllan and international students.",
	});
}
