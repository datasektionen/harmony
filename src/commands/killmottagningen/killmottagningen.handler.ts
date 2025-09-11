import { Guild } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handleKillMottagningen = async(
	interaction: GuildChatInputCommandInteraction
) => {
	const guild = interaction.guild;
	guild.roles.fetch();

	// Remove roles "Grupp A-Z"
	guild.roles.cache
		.filter(r => /Grupp [A-Z]/.test(r.name))
		.forEach(r => guild.roles.delete(r));

	clearReceptionRoles(guild);
};

const clearReceptionRoles = async(
	guild: Guild
) => {
	const receptionRoles = ["Titel", "Mottagare", "Dadderiet", "Quisineriet", "Ekonomeriet", "Doqumenteriet"];
	receptionRoles.forEach(roleName => {
		const role = guild.roles.cache.find(r => r.name === roleName);
		if (!role)
			return console.log("${roleName} role doesn't exist!");
		role.setHoist(false);
		role.setMentionable(false);
	});
};
