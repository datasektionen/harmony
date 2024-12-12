import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export const handleClubList = async (
    interaction: GuildChatInputCommandInteraction, 
    roleName: string
): Promise<void> => {
    const { guild } = interaction;
    await guild.members.fetch();
    const role = guild.roles.cache.find((role) => role.name === roleName);
    const list = role?.members.map(m => m.user.tag).join(", ");

    if (list === "") {
        await interaction.editReply({
            content: `There is no user with the role ${role}!`,
        });
    } else {
        await interaction.editReply({
            content: `The users with the role ${role} are: ${list}`,
        });
    };
};
