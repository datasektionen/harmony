import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { insertNollegrupp } from "../../../../db/db";
import { NollegruppAddVariables } from "./nollegrupp-add.variables";

export async function handleNollegruppAdd(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const name = interaction.options.getString(NollegruppAddVariables.NAME, true);
	const code = interaction.options.getString(NollegruppAddVariables.CODE, true);

	let result = false;

	// The options should never be null because name and code are required.
	if (name != null && code != null) {
		result = await insertNollegrupp(name, code);
	}

	if (!result) {
		await interaction.editReply({
			content: `Failed to add nØllegrupp ${name}. The cause of this error may be that another nØllegrupp with name "${name}" or code "${code}" already exists in the database.`,
		});
	} else {
		await interaction.editReply({
			content: `Successfully added nØllegrupp ${name} with code ${code} to database.`,
		});
	}
}
