import {
	Collection,
	Guild,
	Role as DiscordRole,
	GuildMember as DiscordGuildMember,
} from "discord.js";
import {
	Roles as DfunktRoles,
	Role as DfunktRole,
	Mandate as DfunktMandate,
	Roles,
} from "../shared/utils/dfunkt-interfaces";
import { getAllRoles } from "../shared/utils/dfunkt";
import {
	dfunktGroupToDiscordRoleMapping,
	dfunktToDiscordRoleMappings,
	discordDfunktRole,
	discordDfunktRolesIds,
} from "./dfunkt-roles-mapping";
import {
	testDfunktGroupToDiscordRoleMapping,
	testDfunktToDiscordRoleMappings,
	testDiscordDfunktRole,
	testDiscordDfunktRolesIds,
} from "../tests/dfunkt-roles-update/test-dfunkt-roles-mapping";

import { getDiscordIdByKthid } from "../db/db";

/**
 * Script for updating the Discord roles according to the current mandates listed in
 * dfunkt.datasektionen.se. It updates the dFunk and dRek roles, giving/retaining them for those who have it
 * and should have it, removing the roles from those users which should not have it, and add roles to the new users.
 * @param guild The guild to make the update on, it is assumed to be the 'Konglig Datasektionen' server, or at least
 * that said server have the mappings between functionary roles and the Discord roles defined in **dfunkt-roles-mapping**.
 * @param testing A flag to turn on 'test mode', using different mappings than those in **dfunkt-roles-mapping.ts**.
 * This is to be removed eventually when the correctness of the routine is [mostly] guaranteed.
 */
export async function updateDiscordDfunktRoles(
	guild: Guild,
	testing: boolean = false // For testing purposes only, remove after ensuring correctness
): Promise<void | {
	processedDfunktdata: {
		currentMandates: Map<string, DfunktRole[]>;
		currentGroups: Map<string, string[]>;
		dfunktDiscordRoleLegible: Set<string>;
	};
	dbUsers: Map<string, string>;
	discordData: {
		guildRoles: Collection<string, DiscordRole>;
		guildMembers: Collection<string, DiscordGuildMember>;
	};
	processedDiscordData: {
		toAddToRole: Map<string, string[]>;
    	toRemoveFromRole: Map<string, string[]>;
	}
}> {
	// Dfunkt
	// GET
	const dfunktData = await fetchFromDfunktAPI();
	// Process
	const processedDfunktdata = processDfunktData(dfunktData);
	// DB
	// GET
	const dbUsers = await fetchFromDb(processedDfunktdata);
	// Discord
	// GET
	const discordData = await fetchFromDiscordAPI(guild);
	// Process
	const processedDiscordData = processDiscordData(
		processedDfunktdata,
		dbUsers,
		discordData,
		testing
	);
	// POST
	const modifiedUsers: Set<string> = new Set();
	processedDiscordData.toAddToRole.forEach((roles,user) => modifiedUsers.add(user));
	processedDiscordData.toRemoveFromRole.forEach((roles,user) => modifiedUsers.add(user));
	for (const userId of modifiedUsers) {
		const member = await guild.members.fetch({ user: userId, force: true });
		const finalRoles = new Set(member.roles.cache.map(role => role.id));
		processedDiscordData.toAddToRole.has(userId) 
			? processedDiscordData.toAddToRole.get(userId)!.forEach(role => finalRoles.add(role))
			: 1;
		processedDiscordData.toRemoveFromRole.has(userId) 
			? processedDiscordData.toRemoveFromRole.get(userId)!.forEach(role => finalRoles.delete(role))
			: 1;
		await member.roles.set([...finalRoles]);
	}

	if (testing)
		return {
			processedDfunktdata: processedDfunktdata,
			dbUsers: dbUsers,
			discordData: discordData,
			processedDiscordData: processedDiscordData, 
		};
}

/**
 * Processes the data fetched from the dfunkt API to be later used for the role updates.
 * @param dfunktData The data fetched from the dfunkt API by the **fetchFromDfunktAPI()** function
 * @returns An object of processed data relevant for the update. Includes:
 *  - A mapping of kthid of users currently having mandates to the roles they have mandates on.
 *  - A mapping of dfunkt functionary group identifiers to a list of kthid of users currently in this group
 *  - A set of kthids of users legible for the "dFunkt" role on Discord.
 */
function processDfunktData(dfunktData: DfunktRoles): {
	currentMandates: Map<string, DfunktRole[]>;
	currentGroups: Map<string, string[]>;
	dfunktDiscordRoleLegible: Set<string>;
} {
	// Input data: List of all roles and all of their mandates ever.

	// What we need:
	// Who has which functionary role currently?
	// Make this as a map from kthids to a list of roles. Only those who have some mandate currently are
	// expected to show up as keys of this mapping. Those with no current mandates should have an empty list associated.
	const currentMandates: Map<string, DfunktRole[]> = new Map();

	// What is/are their functionary group?
	// Make this as a map from functionary group identifiers to a list of kthids. Only those with current mandates
	// are expected to be in this map
	const currentGroups: Map<string, string[]> = new Map();

	// Who has had mandates before but not now?
	// First make a set kthids of those who has or have had some mandate, then find the difference with those that
	// currently have mandates
	const hasHadMandates: Set<string> = new Set();
	const dfunktDiscordRoleLegible: Set<string> = new Set();

	dfunktData.forEach((role: DfunktRole) => {
		const dfunktroleGroupId: string = role.Group!.identifier;
		role.Mandates!.forEach((mandate: DfunktMandate) => {
			const userKthiId: string = mandate.User!.kthid;

			if (
				new Date(mandate.start) <= new Date() &&
				new Date() <= new Date(mandate.end)
			) {
				// This is a current mandate, add this role to the list associated with the user in currentMandates.
				currentMandates.has(userKthiId)
					? currentMandates.get(userKthiId)!.push(role)
					: currentMandates.set(userKthiId, [role]);
				// Add the user's kthid to the map of current groups
				currentGroups.has(dfunktroleGroupId)
					? currentGroups.get(dfunktroleGroupId)!.push(userKthiId)
					: currentGroups.set(dfunktroleGroupId, [userKthiId]);
			}
			// Add user's kthid to the set of those that have had some mandate ever.
			hasHadMandates.add(mandate.User!.kthid);
		});
	});

	// Find the difference of the set hasHadMandates w.r.t. to the keyset of currentMandates.
	// Too bad the .difference() method is not available in this project.
	hasHadMandates.forEach((kthid: string) => {
		if (!currentMandates.has(kthid)) dfunktDiscordRoleLegible.add(kthid);
	});

	return {
		currentMandates: currentMandates,
		currentGroups: currentGroups,
		dfunktDiscordRoleLegible: dfunktDiscordRoleLegible,
	};
}

/**
 * Process the Discord API data with the help of the processed data from the dfunkt API, from the db,
 * and the mappings defined in **dfunkt-roles-mappings.ts**.
 * @param dfunktProcessedData Processed data from dfunkt API.
 * @param dfunktKthDiscordUsers Map of KTH IDs of Discord users to their Discord user ID.
 * @param discordData All users and roles of the Discord server at the moment these were fetched.
 * @param testing See docstring for **updateDiscordDfunktRoles**
 * @returns An object of processed data relevant for the update. Includes:
 *  - A map of user Discord IDs to a list of IDs of Discord roles to add to these uses.
 *  - A map of user Discord IDs to a list of IDs of Discord roles to remove from these uses.
 */
function processDiscordData(
	dfunktProcessedData: ReturnType<typeof processDfunktData>,
	dfunktKthDiscordUsers: Awaited<ReturnType<typeof fetchFromDb>>,
	discordData: Awaited<ReturnType<typeof fetchFromDiscordAPI>>,
	testing: boolean = false
): {
	toAddToRole: Map<string, string[]>;
	toRemoveFromRole: Map<string, string[]>;
} {
	// What we need:
	// Which roles are relevant for the update.
	// This is already given in dfunkt-roles-mappings.ts
	// Which users should be removed from the roles
	// Which users should be added to the roles
	// Map user Discord Ids to a list of Discord role IDs for both
	const toRemoveFromRole: Map<string, string[]> = new Map();
	const toAddToRole: Map<string, string[]> = new Map();
	// Divide the task into functionary roles, group roles, and the 'dFunkt' role.
	// These are already given in dfunkt-roles-mappings.ts as mappings from dfunkt role identifiers to Discord role Ids.
	const fetchFailed: Set<string> = new Set();
	// Functionary roles to add
	
	const usedDfunktToDiscordRoleMappings = testing ? testDfunktToDiscordRoleMappings : dfunktToDiscordRoleMappings;
	
	dfunktProcessedData.currentMandates.forEach(
		(roles: DfunktRole[], kthid: string) => {
			roles.forEach((role: DfunktRole) => {
				dfunktKthDiscordUsers.has(kthid)
					? toAddToRole.has(dfunktKthDiscordUsers.get(kthid)!)
						? toAddToRole
								.get(dfunktKthDiscordUsers.get(kthid)!)!
								.push(
									usedDfunktToDiscordRoleMappings.get(
										role.identifier
									)!
								)
						: toAddToRole.set(
								dfunktKthDiscordUsers.get(kthid)!,
								[
									usedDfunktToDiscordRoleMappings.get(
										role.identifier
									)!,
								]
							)
					: fetchFailed.add(kthid); // This should never happen
			});
		}
	);

	const usedDfunktGroupToDiscordRoleMapping = testing ? testDfunktGroupToDiscordRoleMapping : dfunktGroupToDiscordRoleMapping;

	// Group roles to add
	dfunktProcessedData.currentGroups.forEach(
		(kthids: string[], groupIdentifier: string) => {
			kthids.forEach((kthid: string) => {
				dfunktKthDiscordUsers.has(kthid)
					? toAddToRole.has(dfunktKthDiscordUsers.get(kthid)!)
						? toAddToRole
								.get(dfunktKthDiscordUsers.get(kthid)!)!
								.push(
									usedDfunktGroupToDiscordRoleMapping.get(
										groupIdentifier
									)!
								)
						: toAddToRole.set(
								dfunktKthDiscordUsers.get(kthid)!,
								[
									usedDfunktGroupToDiscordRoleMapping.get(
										groupIdentifier
									)!,
								]
							)
					: fetchFailed.add(kthid); // This should never happen
			});
		}
	);

	const usedTestDiscordDfunktRole = testing ? testDiscordDfunktRole : discordDfunktRole;

	// 'dFunkt' role to add
	dfunktProcessedData.dfunktDiscordRoleLegible.forEach(
		(kthid: string) => {
			dfunktKthDiscordUsers.has(kthid)
				? toAddToRole.has(dfunktKthDiscordUsers.get(kthid)!)
					? toAddToRole
							.get(dfunktKthDiscordUsers.get(kthid)!)!
							.push(usedTestDiscordDfunktRole)
					: toAddToRole.set(dfunktKthDiscordUsers.get(kthid)!, [
						usedTestDiscordDfunktRole,
						])
				: fetchFailed.add(kthid); // This should never happen
		}
	);
	
	const usedDiscordDfunktRolesIds = testing ? testDiscordDfunktRolesIds : discordDfunktRolesIds;
	
	// Only have the relevant roles
	const retainedRoles = discordData.guildRoles.filter((role, key) =>
		usedDiscordDfunktRolesIds.includes(key)
	);

	// Go through the members of each role and add them to be removed from the role if they do not
	// appear in the list associated with them in toAddToRole as the user will have the role iff they should.
	retainedRoles.each((role, roleId) => {
		role.members.each((user, userId) => {
			if (!toAddToRole.get(userId)?.includes(roleId)) {
				toRemoveFromRole.has(userId)
					? toRemoveFromRole.get(userId)!.push(roleId)
					: toRemoveFromRole.set(userId, [roleId]);
			}
		});
	});

	return {
		toAddToRole: toAddToRole,
		toRemoveFromRole: toRemoveFromRole,
	};
}

/**
 * Fetch data from the dfunkt API that is needed for the main update.
 * @returns A promise of a list of dfunkt functionary roles, more specifically one containing all roles
 * and all mandates on these ever.
 */
async function fetchFromDfunktAPI(): Promise<Roles> {
	// It is enough to have the data of all roles and all of their mandates ever to get the relevant data
	// Question: Would this be too much data at some point?
	const data: Roles = await getAllRoles();
	return data;
}
/**
 * Fetch the Discord IDs of relevant users from the database based on the processed data from the dfunkt API.
 * @param processedDfunktData Data from the dfunkt API processed by **processDfunktData**
 * @returns A mapping from the kthid of users relevant to the update to their Discord ID.
 */
async function fetchFromDb(
	processedDfunktData: ReturnType<typeof processDfunktData>
): Promise<Map<string, string>> {
	// We only need the Discord ID of the users that should have roles, if these are even registered in the db
	// Since it is expected that currentMandates and currentGroups have the same keyset it is enough to iterate
	// over either of them, and the set dfunktDiscordRoleLegible should be disjoint from the keysets of
	// currentMandates and currentGroups.
	const dfunktKthDiscordUsers: Map<string, string> = new Map();
	const ignored: Set<string> = new Set();
	for (const [kthid] of processedDfunktData.currentMandates) {
		const resolvedDiscordId = await getDiscordIdByKthid(kthid);
		if (resolvedDiscordId != null)
			dfunktKthDiscordUsers.set(kthid, resolvedDiscordId);
		else ignored.add(kthid);
	}
	for (const kthid of processedDfunktData.dfunktDiscordRoleLegible) {
		const resolvedDiscordId = await getDiscordIdByKthid(kthid);
		if (resolvedDiscordId != null)
			dfunktKthDiscordUsers.set(kthid, resolvedDiscordId);
		else ignored.add(kthid);
	}
	// console.warn(
	// 	"Error fetching Discord ID for users with kthid: " +
	// 		Array.from(ignored).join(", ") +
	// 		"; they will be ignored during the update."
	// );
	return dfunktKthDiscordUsers;
}

/**
 * Fetch relevant data from the Discord API for the update.
 * @param guild The server to fetch the data from
 * @returns An object containing all users and roles in the input guild at the moment of the fetch.
 */
async function fetchFromDiscordAPI(guild: Guild): Promise<{
	guildRoles: Collection<string, DiscordRole>;
	guildMembers: Collection<string, DiscordGuildMember>;
}> {
	// Although quite excessive and possibly ruducible, fetching all roles and users is enough.
	// Could be improved by using the results of processDfunktData together with the db to find a limited list
	// of users and roles to fetch.
	const guildRoles = await guild.roles.fetch(undefined, { force: true });
	const guildMembers = await guild.members.fetch();

	return {
		guildRoles: guildRoles,
		guildMembers: guildMembers,
	};
}
