import { User } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { setRole, hasRole } from "../../../../shared/utils/roles";


export const handleClubGive = async (
	interaction: GuildChatInputCommandInteraction,
	role: string,
    targetUser: User
): Promise<void> => {
	const { guild, user } = interaction;
    if (await hasRole(targetUser, role, guild)) {
		await interaction.editReply({
			content: `${targetUser} already has role ${role}!`,
		});
		return;
    }
	try {
		await setRole(targetUser, role, guild);
		await interaction.editReply({
			content: `Gave role ${role} to ${targetUser}!`,
		});
	} catch (error) {
		if (error instanceof Error) {
			await interaction.editReply({
				content: "Error when giving role:" + error.message,
			});
		} else {
			await interaction.editReply({
				content: "An unknown error occured!",
			});
		}
	}
};



