import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { deleteNollegrupp } from "../../../../db/db";
import { NollegruppRemoveVariables } from "./nollegrupp-remove.variables";

export async function handleNollegruppRemove(
    interaction: GuildChatInputCommandInteraction
): Promise<void> {
    const name = interaction.options.getString(NollegruppRemoveVariables.NAME);

    // name is never null.
    if (name != null) {
        await deleteNollegrupp(name);
    }

    await interaction.editReply(`Successfully removed nØllegrupp ${name} from database.`)
}