import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";

export async function handleMottagningenRmGroups(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const guild = interaction.guild;

	// Remove roles "Grupp A-Z"
	await Promise.all([
		guild.roles.cache
			.filter((r) => /Grupp [A-Z]/.test(r.name))
			.forEach((r) => guild.roles.delete(r)),
	]);

	interaction.editReply("Removed all nØllegrupp roles.");
}
