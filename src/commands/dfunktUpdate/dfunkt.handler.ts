import { updateDiscordDfunktRoles } from "../../jobs/update-dfunk-roles-get-post";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handleDfunkt = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await updateDiscordDfunktRoles(interaction.guild);
}