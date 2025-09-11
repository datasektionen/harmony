import { Guild } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { getRole } from "../../shared/utils/roles";

export const handleKillMottagningen = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const guild = interaction.guild;
	guild.roles.fetch();

	await Promise.all([
		// Remove roles "Grupp A-Z"
		guild.roles.cache
			.filter((r) => /Grupp [A-Z]/.test(r.name))
			.forEach((r) => guild.roles.delete(r)),

		clearReceptionRoles(guild),
		getRole("nØllan", guild).edit({ name: "D-25" }),
	]);
};

const clearReceptionRoles = async (guild: Guild): Promise<void> => {
	const receptionRoles = [
		"Titel",
		"Mottagare",
		"Dadderiet",
		"Quisineriet",
		"Ekonomeriet",
		"Doqumenteriet",
	];

	await Promise.all(
		receptionRoles.map(async (roleName) => {
			const role = getRole(roleName, guild);
			await role.setHoist(false);
			await role.setMentionable(false);
			role.members.forEach((member) => member.roles.remove(role));
		})
	);
};
