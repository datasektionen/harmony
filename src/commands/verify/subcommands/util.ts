import { Guild, User } from "discord.js";
import { verifiedUsers } from "../../../database-config";
import { extractYearFromUser, setExternRole, setPingRoles, setRoleVerified, setYearRoles } from "../../../shared/utils/roles";
import { mapYearToAlias } from "../../../shared/utils/alias_to_year_mapper";
import { handleChannelAlias } from "../../../shared/utils/channel-utils";
import { joinChannel } from "../../join/join.handler";

export const isKthEmail = (messageText: string): boolean =>
	new RegExp(/^[a-zA-Z0-9]+@kth[.]se$/).test(messageText);

export const messageIsToken = (messageText: string): RegExpMatchArray | null =>
	messageText.match(/^[a-zA-Z0-9_-]+$/);

export const verifyUser = async (
	user: User,
	guild: Guild,
	emailAddress: string,
): Promise<void> => {
	verifiedUsers.set(user.id, emailAddress);
	console.log(`Verified user by kth email. email="${emailAddress}" user.id="${user.id}" user.username="${user.username}"`);
	
	await setRoleVerified(user, guild);
	const { year, yearRole } = await extractYearFromUser(emailAddress);
	if (yearRole && year) {
		await setYearRoles(user, yearRole, guild);
		const alias = mapYearToAlias(year);
		if (alias)
			await handleChannelAlias(guild, user, alias, joinChannel);
	} else setExternRole(user, guild);

	await setPingRoles(user, guild);
}
