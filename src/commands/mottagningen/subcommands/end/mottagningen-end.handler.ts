import { Guild, User } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { getRole } from "../../../../shared/utils/roles";
import { getCurrentYearRole } from "../../../../shared/utils/year";
import { getCategory } from "../../../../shared/utils/category";
import { getHodisUser } from "../../../../shared/utils/hodis";
import { verifyUser } from "../../../verify/subcommands/util";
import { clearNollegrupper, getAllNollan, insertUser } from "../../../../db/db";
import * as log from "../../../../shared/utils/log";
import { clientIsLight } from "../../../../shared/types/light-client";

export const handleMottagningenEnd = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	interaction.editReply("Ending mottagningen...");
	const guild = interaction.guild;
	guild.roles.fetch();

	let nollanCategory = null;
	try {
		nollanCategory = getCategory("nØllan", guild);
	} catch (err) {
		interaction.editReply(
			"Failed to end mottagningen! Cause given below:\n\nCould not find the nØllan category."
		);
		return;
	}

	let nollanRole = null;
	try {
		nollanRole = getRole("nØllan", guild);
	} catch (err) {
		interaction.editReply(
			`Failed to end mottagningen! Cause given below:\n\n${err}`
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
			`Failed to end mottagningen! Cause given below:\n\n${err}`
		)
	);

	interaction.editReply(
		`Finished! Welcome to a new era where ${getCurrentYearRole()} exists.`
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

const dmErrorToNollan = async (user: User, kthid: string): Promise<void> => {
	try {
		const dm = await user.createDM(true);

		await dm.send(
			"**OBS: Om du redan har verifierat dig på servern kan du ignorera detta meddelande. Vi ber om ursäkt för besväret!\n\n**" +
				`KTH-användarnamnet \`${kthid}\`, som du angav för några veckor sedan, visar sig vara felaktigt!\n\n` +
				"Gå in och verifiera dig på nytt i https://discord.com/channels/687747877736546335/1021025877124976680 och skriv till en admin om det inte fungerar."
		);
	} catch (err) {
		throw err;
	}
};

const verifyAllNollan = async (guild: Guild): Promise<void> => {
	const nollan = await getAllNollan();

	// Cursed iteration over rows in the nollan table.
	await Promise.all(
		nollan.map(async (row) => {
			let member = null;
			try {
				member = await guild.members.fetch(row.discord_id);
			} catch (err) {
				log.error(`${err}`);
			}

			const hodisUser = await getHodisUser(row.kth_id);

			// nØllan left :(
			if (member === null) {
				log.error(
					`nØllan with KTH-id "${row.kth_id}" does not exist on the server (anymore).`
				);
			} else if (hodisUser) {
				await verifyUser(
					member.user,
					guild,
					row.kth_id,
					clientIsLight(guild.client)
				);
				const insertSuccess = await insertUser(row.kth_id, member.id);
				// KTH ID already used by another user
				if (!insertSuccess) {
					try {
						await dmErrorToNollan(member.user, row.kth_id);
					} catch (err) {
						log.error(`${err}`);
						log.error(
							`Failed to send message to user with KTH-id "${row.kth_id}".`
						);
					}
					log.error(
						`nØllan ${member.user.username} had typed KTH ID "${row.kth_id}" but it already existed in HarmonyDB!`
					);
				}
			} else {
				try {
					await dmErrorToNollan(member.user, row.kth_id);
				} catch (err) {
					log.error(`${err}`);
					log.error(
						`Failed to send message to user with KTH-id "${row.kth_id}".`
					);
				}
				log.error(
					`nØllan ${member.user.username} had typed KTH ID "${row.kth_id}" but it doesn't exist on Hodis!`
				);
			}
		})
	);
};
