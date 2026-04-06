// export const messageIsToken = (messageText: string): RegExpMatchArray | null =>
// 	messageText.match(/^[a-zA-Z0-9_-]+$/);

// export const verifyUser = async (
// 	user: User,
// 	guild: Guild,
// 	kthId: string,
// 	isLight: boolean
// ): Promise<void> => {
// 	log.info(
// 		`Verified user by kth email. kthid="${kthId}" user.id="${user.id}" user.username="${user.username}"`
// 	);

// 	await setRoleVerified(user, guild);

// 	if (isLight) return;

// 	// const { year, yearRole } = await extractYearFromUser(kthId);
// 	const { year, yearRole } = {year: 2024, yearRole: "D-24"}; // TODO: FIX!!
// 	const userHasYearRole = await hasAnyYearRole(user, guild);

// 	if (yearRole && year) {
// 		if (!userHasYearRole) await setRole(user, yearRole, guild);
// 		await setDatasektionenRole(user, guild);
// 		const alias = mapYearToAlias(year);
// 		if (alias) {
// 			const role = roleAliases.get(alias);

// 			// This should never be false.
// 			if (role !== undefined) setRole(user, role, guild);
// 		}
// 	} else if (!userHasYearRole) setExternRole(user, guild);

// 	await setPingRoles(user, guild);

// 	if (await hasRole(user, "old verified", guild))
// 		await removeRole(user, "old verified", guild);
// };
