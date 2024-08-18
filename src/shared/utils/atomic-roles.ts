import { Guild, User } from "discord.js";

export async function addRolesOrRollback(
	user: User,
	guild: Guild,
	roleAddingCallback: (user: User, guild: Guild) => Promise<void>
): Promise<void> {
	const userAsMember = await guild.members.fetch(user);
	const userRolesBackup = userAsMember.roles.cache.clone();
	try {
		await roleAddingCallback(user, guild);
	} catch (e) {
		await userAsMember.roles.set(userRolesBackup);
		throw e;
	}
}
