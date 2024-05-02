import { GuildMember } from "discord.js";
import * as db from "../../db/db";
import { verifyUser } from "../../commands/verify/subcommands/util";

export const userJoined = async (member: GuildMember): Promise<void> => {
    const kthid = await db.getKthIdByUserId(member.id);
    if (kthid !== null) {
        try {
            verifyUser(member.user, member.guild, kthid + "@kth.se");
        } catch (error) {
            console.warn(error);
        }
    }
}
