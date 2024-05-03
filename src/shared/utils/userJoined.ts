import { GuildMember } from "discord.js";
import * as db from "../../db/db";
import { verifyUser } from "../../commands/verify/subcommands/util";

export const userJoined = async (member: GuildMember): Promise<void> => {
    const kthId = await db.getKthIdByUserId(member.id);
    if (kthId !== null) {
        try {
            verifyUser(member.user, member.guild, kthId);
        } catch (error) {
            console.warn(error);
        }
    }
}
