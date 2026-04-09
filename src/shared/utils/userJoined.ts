import { GuildMember } from "discord.js";
import * as db from "../../db/db";
import { isDarkmode } from "./darkmode";
import { setN0llanRole } from "./roles";
import * as log from "./log";
import { verifyUser } from "./auth";

export const userJoined = async (
	member: GuildMember,
	isLight: boolean
): Promise<void> => {
	const kthId = await db.getKthIdByUserId(member.id);
	const darkmode = await isDarkmode();

	if (kthId !== null && !darkmode) {
		try {
			verifyUser(member.user, member.guild, kthId, isLight);
		} catch (error) {
			log.error(`${error}`);
		}
	}

	if (darkmode) {
		const kthId = await db.getKthIdByNolleId(member.id);
		if (kthId !== null && !isLight) {
			try {
				setN0llanRole(member.user, member.guild);
			} catch (error) {
				log.error(`${error}`);
			}
		}
	}
};
