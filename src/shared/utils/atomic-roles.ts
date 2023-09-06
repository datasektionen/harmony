import { Guild, User } from "discord.js";
import { getGuildMember } from "./guild";

export async function addRolesOrRollback(user: User, guild: Guild, roleAddingCallback: (user: User, guild: Guild) => Promise<void>): Promise<void> {
    const userAsMember = await getGuildMember(user, guild);
    const userRolesBackup = userAsMember.roles.cache.clone();
    try {
        await roleAddingCallback(user, guild);
    } catch (e) {
        await userAsMember.roles.set(userRolesBackup);
        throw e;
    }
}