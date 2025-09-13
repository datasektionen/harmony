import { Guild, User } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { getRole } from "../../shared/utils/roles";
import { getCurrentYearRole } from "../../shared/utils/year";
import { getCategory } from "../../shared/utils/category";
import { getHodisUser } from "../../shared/utils/hodis";
import { verifyUser } from "../verify/subcommands/util";
import { clearNollan, clearNollegrupper, getKthIdByNolleId, insertUser } from "../../db/db";
import * as log from "../../shared/utils/log";
import { clientIsLight } from "../../shared/types/light-client";

export const handleKillMottagningen = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	interaction.reply("Ending mottagningen...");
	const guild = interaction.guild;
	guild.roles.fetch();

	await Promise.all([
		// Add group members to each group channel?

		// Remove roles "Grupp A-Z"
		guild.roles.cache
			.filter((r) => /Grupp [A-Z]/.test(r.name))
			.forEach((r) => guild.roles.delete(r)),

		clearReceptionRoles(guild),
		getRole("nØllan", guild).edit({ name: getCurrentYearRole(), icon: null }),
		getCategory("nØllan", guild).edit({ name: getCurrentYearRole() }),
		clearNollegrupper(),
		verifyAllNollan(guild),
	]);

	interaction.editReply(`Finished! Now see the new era where ${getCurrentYearRole()} exists.`)
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
			await role.setHoist(false); // Not separate on member list
			await role.setMentionable(false);
			role.members.forEach((member) => member.roles.remove(role));
		})
	);

	await getRole("Storasyskon", guild).setHoist(false);
	await getRole("dFunk", guild).setHoist(true);
	await getRole("D-rek", guild).setHoist(true);
};

const dmErrorToNollan = async (user: User, kthid: string): Promise<void> => {
	const dm = await user.createDM(true);
	await dm.send(
		`KTH-användarnamnet \`${kthid}\`, som du angav för några veckor sen, visar sig vara felaktigt!\n\n` +
		"Gå in och verifiera dig på nytt i https://discord.com/channels/687747877736546335/1021025877124976680 och skriv till en admin om det inte fungerar."
	);
}

const verifyAllNollan = async (guild: Guild): Promise<void> => {
	const nollan = getRole("nØllan", guild).members;

	await Promise.all(nollan.map(async member => {
		const kthid = await getKthIdByNolleId(member.id);
		if (!kthid)
			return log.error(`nØllan ${member.nickname} did not have a KTH ID in HarmonyDB!`);

		if (await getHodisUser(kthid)) {
			verifyUser(member.user, guild, kthid, clientIsLight(guild.client));
			const insertSuccess = insertUser(kthid, member.id);
			if (!insertSuccess) // KTH ID already used by another user
				dmErrorToNollan(member.user, kthid);
				log.error(`nØllan ${member.nickname} had typed KTH ID ${kthid} but it already existed in HarmonyDB!`);
		} else {
			dmErrorToNollan(member.user, kthid);
			log.error(`nØllan ${member.nickname} had typed KTH ID ${kthid} but it doesn't exist on Hodis!`);
		}
	}));

	clearNollan(); // Clear nollan DB table
};
