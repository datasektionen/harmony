import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { removeRole, hasRole } from "../../../../shared/utils/roles";
import { ClubVariables } from "../club.variables";

export const handleClubRemove = async (
	interaction: GuildChatInputCommandInteraction,
	role: string
): Promise<void> => {
	const { guild } = interaction;
	const targetUser = interaction.options.getUser(ClubVariables.TARGET, true);
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
