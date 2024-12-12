import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { setRole, hasRole } from "../../../../shared/utils/roles";
import { ClubVariables } from "../club.variables";

export const handleClubGive = async (
	interaction: GuildChatInputCommandInteraction,
	role: string
): Promise<void> => {
	const { guild } = interaction;
	const targetUser = interaction.options.getUser(ClubVariables.TARGET, true);
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
				content: "Error when giving role: " + error.message,
			});
		} else {
			await interaction.editReply({
				content: "An unknown error occured!",
			});
		}
	}
};
