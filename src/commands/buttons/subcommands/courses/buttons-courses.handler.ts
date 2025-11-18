import { MessageFlags } from "discord.js";
import { GuildButtonInteraction } from "../../../../shared/types/GuildButtonInteraction";
import { roleAliases } from "../../../../shared/alias-mappings";
import {
	hasRole,
	hasRoleVerified,
	toggleYearCoursesRole,
} from "../../../../shared/utils/roles";

export async function handleCourseButtonInteraction(
	interaction: GuildButtonInteraction
): Promise<void> {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	const isVerified: boolean = await hasRoleVerified(
		interaction.user,
		interaction.guild
	);
	if (!isVerified) {
		await interaction.editReply({
			content: "Only verified users can join courses.",
		});
		return;
	}

	// interaction.customId will always be a valid alias, and
	// all course button aliases are role aliases.
	const role = roleAliases.get(interaction.customId);
	if (role !== undefined) {
		await toggleYearCoursesRole(interaction.user, interaction.guild, role);

		const isMemberOfAlias = await hasRole(
			interaction.user,
			role,
			interaction.guild
		);
		const actionVerb = isMemberOfAlias ? "joined" : "left";

		await interaction.editReply({
			content: `Successfully ${actionVerb} \`${interaction.customId}\`!`,
		});
	}
}
