import { Guild, User } from "discord.js";
import {
	hasRole,
	removeRole,
	setExternRole,
	setPingRoles,
	setRoleVerified,
	setYearRoles,
} from "../../../shared/utils/roles";
import { extractYearFromUser } from "../../../shared/utils/hodis";
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
	kthId: string
): Promise<void> => {
	console.log(
		`Verified user by kth email. kthid="${kthId}" user.id="${user.id}" user.username="${user.username}"`
	);

	await setRoleVerified(user, guild);
	const { year, yearRole } = await extractYearFromUser(kthId);
	if (yearRole && year) {
		await setYearRoles(user, yearRole, guild);
		const alias = mapYearToAlias(year);
		if (alias) await handleChannelAlias(guild, user, alias, joinChannel);
		
		if (await hasRole(user, "old verified", guild))
			await removeRole(user, "old verified", guild);
	} else setExternRole(user, guild);

	await setPingRoles(user, guild);
};
