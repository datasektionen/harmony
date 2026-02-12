import { Guild, User } from "discord.js"; import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { getRole, hasRoleVerified } from "../../../../shared/utils/roles";
import { getCurrentYearRole } from "../../../../shared/utils/year";
import { getCategory } from "../../../../shared/utils/category";
import { getHodisUser } from "../../../../shared/utils/hodis";
import { verifyUser } from "../../../verify/subcommands/util";
import { clearNollegrupper, getAllNollan, insertUser } from "../../../../db/db";
import * as log from "../../../../shared/utils/log";
import { clientIsLight } from "../../../../shared/types/light-client";

export const handleMottagningenStart = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	interaction.editReply("Start mottagningen...");
	const guild = interaction.guild;
	guild.roles.fetch();

	let nollanCategory = null;
	try {
		nollanCategory = getCategory("nØllan", guild);
	} catch (err) {
		interaction.editReply(
			`Failed to start mottagningen! Cause given below:\n\`\`\`${err}\`\`\``
		);
		return;
	}

	let nollanRole = null;
	try {
		nollanRole = getRole("nØllan", guild);
	} catch (err) {
		interaction.editReply(
			`Failed to start mottagningen! Cause given below:\n\`\`\`${err}\`\`\``
		);
		return;
	}

	await Promise.all([
		// Remove roles "Grupp A-Z"
		guild.roles.cache
			.filter((r) => /Grupp [A-Z]/.test(r.name))
			.forEach((r) => guild.roles.delete(r)),

		clearReceptionRoles(guild),
		nollanCategory.edit({
			name: `╒══════╣ ${getCurrentYearRole()} ╠══════╕`,
		}),
		// Note that the intis code is also removed.
		clearNollegrupper(),
		nollanRole.edit({
			name: getCurrentYearRole(),
			icon: null,
		}),
		verifyAllNollan(guild),
	]).catch((err) =>
		interaction.editReply(
			`Failed to start mottagningen! Cause given below:\n\`\`\`${err}\`\`\``
		)
	);

	interaction.editReply(
		`Finished! Watch out for schlem, nØllan is coming.`
	);
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

	receptionRoles.map(async (roleName) => {
		const role = getRole(roleName, guild);
		await role.setHoist(false); // Not separate on member list
		await role.setMentionable(false);
		role.members.forEach((member) => member.roles.remove(role));
	});

	await getRole("Storasyskon", guild).setHoist(false);
	await getRole("Ordförande", guild).setHoist(true);
	await getRole("dFunk", guild).setHoist(true);
	await getRole("D-rek", guild).setHoist(true);
};
