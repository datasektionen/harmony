import { Guild, Role as DiscordRole } from "discord.js";
import {
	Roles as DfunkRoles,
	Role as DfunkRole,
	Mandate as DfunkMandate,
} from "../shared/utils/dfunk-interfaces";
import { getAllRoles } from "../shared/utils/dfunk";
import { getDiscordIdByKthid } from "../db/db";
import { getHiveGroupMembers, getHiveGroups } from "../shared/utils/hive";
import * as log from "../shared/utils/log";
// List group and special dfunk-related roles (names), expand these lists accordingly if more special
// roles are added in the future
const groupRoleNames = ["dFunk", "D-rek"];
const specialRoleNames = ["dFunkt"];

// Map dfunk group identifiers to their corresponding Discord role's name. This list is to be modified
// if changes to these functionary groups are changed
const dfunkGroupToDiscordRoleMapping = new Map([
	["dfunk", "dFunk"],
	["proj", "dFunk"],
	["drek", "D-rek"],
]);

/**
 * Script for updating the Discord roles according to the current mandates listed in
 * Hive and dfunkt.datasektionen.se. It updates the dFunk and dRek roles, giving/retaining them for those who have it
 * and should have it, removing the roles from those users which should not have it, and add roles to the new users.
 *
 * Additionally, the script creates any missing Discord roles upon execution.
 * @param guild The guild to make the update on.
 * @returns Information about the performed update, more specifically:
 * - **processedDfunkData**: Contains the processed data from the dfunk API by the update program.
 * - **dbUsers**: A map mapping a user's kthid to their Discord ID according to the application's database.
 * - **discordData**: An object containing the roles (**guildRoles**) and members (**guildMembers**) from the guild updated before the update took place. 
 * - **modifiedUsersMap**: An object containing information about which roles where added to/removed from users during the update by mapping the user's Discord ID to a list of roles to add/remove. 
 */
export async function updateDiscordDfunkRoles(
	guild: Guild,
): Promise<{
	processedDfunkData: Awaited<ReturnType<typeof processDfunkData>>;
	dbUsers: typeof dfunkDiscordUsers;
	discordData: {
		guildRoles: typeof guildRoles;
		guildMembers: typeof guildMembers;
	};
	modifiedUsersMap: {
		toAddToRole: typeof toAdd;
		toRemoveFromRole: typeof toRemove;
	};
}> {
	log.info("Running update on server " + guild.name + " (" + guild.id + ")");
	// Data
	// Variables containing log info
	const failedDatabaseKthIdQueries: Set<string> = new Set();
	const dfunkGroupRolesNotUpdated: Set<string> = new Set();
	const createdDiscordRoles: Set<string> = new Set();
	// Maps of roles to add and remove from users (user Discord ID mapped to a list of names of DiscordRoles)
	const toAdd: Map<string, string[]> = new Map();
	const toRemove: Map<string, string[]> = new Map();
	// Fetch current Discord Role data
	const guildRoles = await guild.roles.fetch();
	console.log("Fetching members...")
	const guildMembers = await guild.members.fetch();
	console.log("Fetched members...")
	// Map of dfunk-related Discord roles' names to the roles themselves, useful to avoid
	// creation of duplicate roles in the case that these do not exist
	const dfunkDiscordRoles: Map<string, DiscordRole> = new Map();
	// Map of dfunk-related users' kthids to their Discord ID, useful to cache queries from database.
	const dfunkDiscordUsers: Map<string, string> = new Map();

	// Helper functions
	/**
	 * Try finding a role in the guild with a given name **roleName** among the cached roles in
	 * `guildRoles`, if no such role is found, create a new one with that name. As a side-effect,
	 * add this role to the scope structure `createdDiscordRoles` if created.
	 * @param roleName The name of the role to search in the guild.
	 * @returns The role if found on the server, or a new created role in the guild with said name.
	 */
	async function findRoleCreateByName(
		roleName: string
	): Promise<DiscordRole> {
		let role = guildRoles.find((role) => role.name === roleName);
		if (role === undefined) {
			role = await guild.roles.create({
				name: roleName,
				color: "#ee2a7b", // Never forget the cerise.
				reason: "Role not found during dfunk update.",
			});
			createdDiscordRoles.add(roleName);
		}
		return role;
	}
	/**
	 * Given a user's Kth-ID, try querying the database for its Discord ID and return it. If the query fails,
	 * return null and store the kthid in `failedDatabaseKthIdQueries`, representing a query to a user kthid
	 * not registered in the database. If the kthid was already cached in the `dfunkDiscordUsers` map, return
	 * the value associated with the kthid in said map.
	 * @param kthid Kth-ID of user to query.
	 * @returns The Discord ID of the user associated with the input Kth-ID, if it is registered in the
	 * database. Otherwise return null.
	 */
	async function fetchUserFromDbCache(kthid: string): Promise<string | null> {
		if (!dfunkDiscordUsers.has(kthid)) {
			const queryResult = await getDiscordIdByKthid(kthid);
			if (queryResult !== null) {
				dfunkDiscordUsers.set(kthid, queryResult);
			} else {
				failedDatabaseKthIdQueries.add(kthid);
			}
			return queryResult;
		} else {
			return dfunkDiscordUsers.get(kthid)!;
		}
	}

	// Main Code

	// Fetch kthid of users and mandate roles these should currently have from Hive,
	// Construct a list of roles relevant to the update
	const hiveTagGroups = await getHiveGroups("discord-role");

	for (const tagGroup of hiveTagGroups) {
		// kthids of users with this mandate
		const groupMembers = await getHiveGroupMembers(
			tagGroup.group_id,
			tagGroup.group_domain
		);
		const dfunkDiscordRole = await findRoleCreateByName(
			tagGroup.tag_content
		);
		// Add role to the mapping for unique roles
		!dfunkDiscordRoles.has(tagGroup.tag_content)
			? dfunkDiscordRoles.set(tagGroup.tag_content, dfunkDiscordRole)
			: 1;
		// If user in database, update the ´toAdd´ map, use/update `dfunkDiscordUsers` for caching
		for (const memberKthId of groupMembers) {
			const memberDiscordId = await fetchUserFromDbCache(memberKthId);
			if (memberDiscordId === null) {
				continue;
			} // Skip user if not found in database
			toAdd.has(memberDiscordId)
				? toAdd.get(memberDiscordId)!.push(dfunkDiscordRole.name)
				: toAdd.set(memberDiscordId, [dfunkDiscordRole.name]);
		}
	}
	// Check that the group and special roles exist in the server, else create them; add them
	// to `dfunkDiscordRoles`.
	for (const groupRoleName of groupRoleNames) {
		const role = await findRoleCreateByName(groupRoleName);
		// Assumption: role names for dfunk-related roles are unique
		!dfunkDiscordRoles.has(groupRoleName)
			? dfunkDiscordRoles.set(groupRoleName, role)
			: 1;
	}
	for (const specialRoleName of specialRoleNames) {
		const role = await findRoleCreateByName(specialRoleName);
		// Assumption: role names for dfunk-related roles are unique
		!dfunkDiscordRoles.has(specialRoleName)
			? dfunkDiscordRoles.set(specialRoleName, role)
			: 1;
	}

	// Use data from dfunk to find out which users should have group and special roles
	const processedDfunkData = await processDfunkData();

	// Update `toAdd` for dfunk group roles
	for (const [
		dfunkRoleIdentifier,
		userKthids,
	] of processedDfunkData.currentGroups) {
		// Check if some dfunk group is not represented in `dfunkGroupToDiscordRoleMapping`
		if (!dfunkGroupToDiscordRoleMapping.has(dfunkRoleIdentifier)) {
			dfunkGroupRolesNotUpdated.add(dfunkRoleIdentifier);
			continue;
		}
		for (const kthid of userKthids) {
			const memberDiscordId = await fetchUserFromDbCache(kthid);
			if (memberDiscordId === null) {
				continue;
			} // Skip user if not found in database
			toAdd.has(memberDiscordId)
				? toAdd
						.get(memberDiscordId)!
						.push(
							dfunkGroupToDiscordRoleMapping.get(
								dfunkRoleIdentifier
							)!
						)
				: toAdd.set(memberDiscordId, [
						dfunkGroupToDiscordRoleMapping.get(
							dfunkRoleIdentifier
						)!,
				  ]);
		}
	}

	// Update `toAdd` for dfunk special roles
	for (const specialRole of processedDfunkData.specialRoles) {
		for (const kthid of specialRole.specialRoleElegibles) {
			const memberDiscordId = await fetchUserFromDbCache(kthid);
			if (memberDiscordId === null) {
				continue;
			} // Skip user if not found in database
			toAdd.has(memberDiscordId)
				? toAdd.get(memberDiscordId)!.push(specialRole.roleName)
				: toAdd.set(memberDiscordId, [specialRole.roleName]);
		}
	}
	// Update the `toRemove` map by checking all members of roles in `dfunkDiscordRoles` and marking
	// those that should not have a role
	for (const [roleName, role] of dfunkDiscordRoles) {
		role.members
			// Key either not existing or the role's name not in the key's associated list.
			.filter(
				(member, memberId) =>
					!toAdd.has(memberId) ||
					!toAdd.get(memberId)!.includes(roleName)
			)
			.forEach((member, memberId) => {
				toRemove.has(memberId)
					? toRemove.get(memberId)!.push(roleName)
					: toRemove.set(memberId, [roleName]);
			});
	}
	// POST
	const modifiedUsers: Set<string> = new Set();
	toAdd.forEach((roles, user) => modifiedUsers.add(user));
	toRemove.forEach((roles, user) => modifiedUsers.add(user));
	for (const userId of modifiedUsers) {
		const member = await guild.members.fetch({ user: userId, force: true });
		const finalRoles = new Set(member.roles.cache.map((role) => role.id));
		toAdd.has(userId)
			? toAdd
					.get(userId)!
					.forEach((roleName) =>
						finalRoles.add(dfunkDiscordRoles.get(roleName)!.id)
					)
			: 1;
		toRemove.has(userId)
			? toRemove
					.get(userId)!
					.forEach((roleName) =>
						finalRoles.delete(dfunkDiscordRoles.get(roleName)!.id)
					)
			: 1;
		await member.roles.set([...finalRoles]);
	}

	// Print log data
	log.warning(
		"Users (kthid) not updated (were not present in database): " +
			Array.from(failedDatabaseKthIdQueries).join(", ") +
			"."
	);
	log.warning(
		"Dfunk group roles (identifiers) not updated (they were not in `dfunkGroupToDiscordRoleMapping`): " +
			Array.from(dfunkGroupRolesNotUpdated).join(", ") +
			"."
	);
	log.warning(
		"Roles created during update (roles with names specified by Hive not in server during update): " +
			Array.from(createdDiscordRoles).join(", ") +
			"."
	);

	return {
		processedDfunkData: processedDfunkData,
		dbUsers: dfunkDiscordUsers,
		discordData: { guildMembers: guildMembers, guildRoles: guildRoles },
		modifiedUsersMap: {
			toAddToRole: toAdd,
			toRemoveFromRole: toRemove,
		},
	};
}
/**
 * Processes the data fetched from the dfunk API to be later used for the role updates.
 * @returns An object of processed data relevant for the update. Includes:
 *  - A mapping of dfunk functionary group identifiers to a list of kthid of users currently in this group
 *  - A list of objects representing special dfunk Discord roles and the users that should have them.
 */
async function processDfunkData(): Promise<{
	currentGroups: Map<string, string[]>;
	specialRoles: [
		{
			roleName: string;
			specialRoleElegibles: Set<string>;
		}
	];
}> {
	const dfunkData = await fetchFromDfunkAPI();
	const currentGroups = getGroupsUpdate(dfunkData);
	const specialRoles = getSpecialRolesUpdate(dfunkData);

	return {
		currentGroups: currentGroups,
		specialRoles: specialRoles,
	};
}
/**
 * Process the data fetched from the dfunk API to determine the role updates, more specifically those concerning
 * current functionary groups.
 * @param dfunkData The data fetched from the dfunk API by the **fetchFromDfunkAPI()** function
 * @returns A map of which users (kthid) are in which dfunk groups (list of dfunk groups' identifiers).
 */
function getGroupsUpdate(dfunkData: DfunkRoles): Map<string, string[]> {
	// What is their functionary group?
	// Make this as a map from functionary group identifiers to a list of kthids. Only those with current mandates
	// are expected to be in this map
	const currentGroups: Map<string, string[]> = new Map();

	dfunkData.forEach((role: DfunkRole) => {
		const dfunkRoleGroupId: string = role.Group!.identifier;
		role.Mandates!.forEach((mandate: DfunkMandate) => {
			const userKthiId: string = mandate.User!.kthid;
			if (
				new Date(mandate.start) <= new Date() &&
				new Date() <= new Date(mandate.end)
			) {
				// Add the user's kthid to the map of current groups
				currentGroups.has(dfunkRoleGroupId)
					? currentGroups.get(dfunkRoleGroupId)!.push(userKthiId)
					: currentGroups.set(dfunkRoleGroupId, [userKthiId]);
			}
		});
	});

	return currentGroups;
}
/**
 * Process the data fetched from the dfunk API to determine the role updates, more specifically those concerning
 * special discord roles. Expand this function if more special roles are to be considered in the future.
 * @param dfunkData The data fetched from the dfunk API by the **fetchFromDfunkAPI()** function
 * @returns A list of objects, each with two attributes each:
 *  - **roleName**: The name of the special role on Discord, containing different structures relevant to the assignment of special roles.
 *  - **specialRoleElegibles**: A set of users (kthids) of the users that should have the special role.
 */
function getSpecialRolesUpdate(dfunkData: DfunkRoles): [
	{
		roleName: string;
		specialRoleElegibles: Set<string>;
	}
] {
	// 'dFunkt' role

	// Who has had mandates before but not now?
	// First make a set kthids of those who has or have had some mandate, then find the difference with those that
	// currently have mandates
	const hasHadMandates: Set<string> = new Set();
	const dfunktDiscordRoleLegible: Set<string> = new Set();
	// Get current mandates
	const currentMandates = getCurrentDfunkMandates(dfunkData);

	dfunkData.forEach((role: DfunkRole) => {
		role.Mandates!.forEach((mandate: DfunkMandate) => {
			hasHadMandates.add(mandate.User!.kthid);
		});
	});

	// Find the difference of the set hasHadMandates w.r.t. to the keyset of currentMandates.
	// Too bad the .difference() method is not available in this project.
	hasHadMandates.forEach((kthid: string) => {
		if (!currentMandates.has(kthid)) dfunktDiscordRoleLegible.add(kthid);
	});

	// // Next special role...

	return [
		{
			roleName: "dFunkt",
			specialRoleElegibles: dfunktDiscordRoleLegible,
		},
	];
}
/**
 * Process the data fetched from the dfunk API to determine the current dfunk mandates, for the purposes
 * of determining the users that should have special roles (like 'dFunkt').
 * @param dfunkData The data fetched from the dfunk API by the **fetchFromDfunkAPI()** function
 * @returns A map of which users (kthid) have which dfunk mandate roles (list of dfunk roles).
 */
function getCurrentDfunkMandates(
	dfunkData: DfunkRoles
): Map<string, DfunkRoles> {
	// Who has which functionary role currently?
	// Make this as a map from kthids to a list of roles. Only those who have some mandate currently are
	// expected to show up as keys of this mapping. Those with no current mandates should have an empty list associated.
	const currentMandates: Map<string, DfunkRole[]> = new Map();
	dfunkData.forEach((role: DfunkRole) => {
		role.Mandates!.forEach((mandate: DfunkMandate) => {
			const userKthiId: string = mandate.User!.kthid;

			if (
				new Date(mandate.start) <= new Date() &&
				new Date() <= new Date(mandate.end)
			) {
				// This is a current mandate, add this role to the list associated with the user in currentMandates.
				currentMandates.has(userKthiId)
					? currentMandates.get(userKthiId)!.push(role)
					: currentMandates.set(userKthiId, [role]);
			}
		});
	});

	return currentMandates;
}
/**
 * Fetch data from the dfunk API that is needed for the main update.
 * @returns A promise of a list of dfunk functionary roles, more specifically one containing all roles
 * and all mandates on these ever.
 */
async function fetchFromDfunkAPI(): Promise<DfunkRoles> {
	// It is enough to have the data of all roles and all of their mandates ever to get the relevant data
	// Question: Would this be too much (unnecesary) data at some point?
	const data: DfunkRoles = await getAllRoles();
	return data;
}

/**
 * For test purposes. Uses data from Hive to check and create missing dfunk-related roles on the Discord server
 */
export async function createDfunkDiscordRoles(guild: Guild): Promise<void> {
	// Fetch all tag groups on Hive related to Discord
	const hiveTagGroups = await getHiveGroups("discord-role");
	// Fetch Discord roles
	const guildRoles = await guild.roles.fetch();
	// For each group, try finding its 'tag_content' field value as a role name on the server
	for (const hiveTagGroup of hiveTagGroups) {
		const roleName = hiveTagGroup.tag_content;
		let role = guildRoles.find((role) => role.name === roleName);
		if (role === undefined) {
			role = await guild.roles.create({
				name: roleName,
				color: "#ee2a7b",
				reason: "Role not found during dfunk update.",
			});
		}
	}
}
