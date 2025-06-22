import { updateDiscordDfunkRoles } from "../../../../jobs/update-dfunk-roles-get-post";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export const handleDfunkUpdate = async (
    interaction: GuildChatInputCommandInteraction
): Promise<void> => {
    await updateDiscordDfunkRoles(interaction.guild);
};