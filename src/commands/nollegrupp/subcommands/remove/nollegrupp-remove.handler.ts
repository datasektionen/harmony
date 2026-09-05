import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { deleteNollegrupp } from "../../../../db/db";
import { NollegruppRemoveVariables } from "./nollegrupp-remove.variables";

export async function handleNollegruppRemove(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const name = interaction.options.getString(
		NollegruppRemoveVariables.NAME,
		true
	);

	let result = false;

	// name is never null.
	if (name !== null) {
		result = await deleteNollegrupp(name);
	}

	if (!result) {
		await interaction.editReply(
			`Failed to remove nØllegrupp ${name} from database.`
		);
	} else {
		await interaction.editReply(
			`Successfully removed nØllegrupp ${name} from database.`
		);
	}
}
