import { Client, GuildMember } from "discord.js";
import * as db from "../../db/db";
import { verifyUser } from "../../commands/verify/subcommands/util";
import { isDangerOfNollan } from "./hodis";
import { isDarkmode } from "./darkmode";

export const userJoined = async (
	member: GuildMember,
	client: Client
): Promise<void> => {
	const kthId = await db.getKthIdByUserId(member.id);
	const darkmode = await isDarkmode();

	if (kthId !== null && !(await isDangerOfNollan(kthId, darkmode))) {
		try {
			verifyUser(member.user, member.guild, kthId, client);
		} catch (error) {
			console.warn(error);
		}
	}
};
