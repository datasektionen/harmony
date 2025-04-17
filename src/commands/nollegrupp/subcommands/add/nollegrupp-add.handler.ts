import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { insertNollegrupp } from "../../../../db/db";
import { NollegruppAddVariables } from "./nollegrupp-add.variables";

export async function handleNollegruppAdd(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const name = interaction.options.getString(NollegruppAddVariables.NAME);
	const code = interaction.options.getString(NollegruppAddVariables.CODE);

	// The options should never be null because name and code are required.
	if (name != null && code != null) {
		await insertNollegrupp(name, code);
	}

	await interaction.editReply({
		content: `Successfully added nØllegrupp ${name} with code ${code} to database.`,
	});
}
