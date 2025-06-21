import { GuildMember } from "discord.js";
import * as db from "../../db/db";
import { verifyUser } from "../../commands/verify/subcommands/util";
import { isDangerOfNollan } from "./hodis";
import { isDarkmode } from "./darkmode";
import { setN0llanRole } from "./roles";

export const userJoined = async (
	member: GuildMember,
	isLight: boolean
): Promise<void> => {
	const kthId = await db.getKthIdByUserId(member.id);
	const darkmode = await isDarkmode();

	if (kthId !== null && !(await isDangerOfNollan(kthId, darkmode))) {
		try {
			verifyUser(member.user, member.guild, kthId, isLight);
		} catch (error) {
			console.warn(error);
		}
	}

	if (darkmode) {
		let kthId = await db.getKthIdByNolleId(member.id);
		if (kthId !== null && !isLight) {
			try {
				setN0llanRole(member.user, member.guild);
			} catch (error) {
				console.warn(error);
			}
		}
	}
};
