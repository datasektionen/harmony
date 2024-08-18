import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { removeRole, hasRole } from "../../../../shared/utils/roles";
import { User } from "discord.js";

export const handleClubRemove = async (
	interaction: GuildChatInputCommandInteraction,
	role: string,
	targetUser: User
): Promise<void> => {
	const { guild } = interaction;
	if (!(await hasRole(targetUser, role, guild))) {
		await interaction.editReply({
			content: `${targetUser} does not have role ${role}!`,
		});
		return;
	}
	try {
		await removeRole(targetUser, role, guild);
		await interaction.editReply({
			content: `Removed role ${role} from ${targetUser}!`,
		});
	} catch (error) {
		if (error instanceof Error) {
			await interaction.editReply({
				content: error.message,
			});
		} else {
			await interaction.editReply({
				content: "An unknown error occured!",
			});
		}
	}
};
