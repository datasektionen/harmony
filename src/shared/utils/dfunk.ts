import {
	UserMandates,
	RoleMandates,
	Roles,
	Users,
	User,
	Role,
	Group,
	Mandate,
} from "./dfunk-interfaces";

const dfunktEndpoint: string = "https://dfunkt.datasektionen.se/";

const APIUrls = {
	getMandateRoles: dfunktEndpoint + "api/roles",
	getIdentifierMandateRole: dfunktEndpoint + "api/role/@",
	getIdentifierMandateRoleCurrent: dfunktEndpoint + "api/role/@/current",
	getIdMandateRole: dfunktEndpoint + "api/role/id/@",
	getIdMandateRoleCurrent: dfunktEndpoint + "api/role/id/@/current",
	getRolesByGroupId: dfunktEndpoint + "api/roles/type/@/all",
	getCurrentRolesByGroupId: dfunktEndpoint + "api/roles/type/@/all/current",
	getAllRoles: dfunktEndpoint + "api/roles/all",
	getAllRolesCurrent: dfunktEndpoint + "api/roles/all/current",
	getKthUsers: dfunktEndpoint + "api/users",
	getKthUserCurrentMandates: dfunktEndpoint + "api/user/kthid/@/current",
	getKthUserMandates: dfunktEndpoint + "api/user/kthid/@",
	getUgkthUserCurrentMandates: dfunktEndpoint + "api/user/ugkthid/@/current",
	getUgkthUserMandates: dfunktEndpoint + "api/user/ugkthid/@",
};

type DfunkInterface =
	| User
	| Role
	| Group
	| Mandate
	| Roles
	| RoleMandates
	| UserMandates
	| Users;

async function dfunkAPICall(
	url: string,
	arg: string | null
): Promise<DfunkInterface> {
	if (arg !== null && url.includes("@")) {
		url = url.replace("@", arg);
	}
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: DfunkInterface = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get all functionary roles.
 */
export async function getMandateRoles(): Promise<Roles> {
	return (await dfunkAPICall(APIUrls.getMandateRoles, null)) as Roles;
}
/**
 * Sends an API call to dfunkt.se to get the role and its mandates ever, given its identifier.
 * @param identifier The role identifier.
 */
export async function getIdentifierMandateRole(
	identifier: string
): Promise<RoleMandates> {
	return (await dfunkAPICall(
		APIUrls.getIdentifierMandateRole,
		identifier
	)) as RoleMandates;
}
/**
 * Sends an API call to dfunkt.se to get the role and its current mandates, given its identifier.
 * @param identifier The role identifier.
 */
export async function getIdentifierMandateRoleCurrent(
	identifier: string
): Promise<RoleMandates> {
	return (await dfunkAPICall(
		APIUrls.getIdentifierMandateRoleCurrent,
		identifier
	)) as RoleMandates;
}
/**
 * Sends an API call to dfunkt.se to get the role and its mandates ever, given its id.
 * @param id The role id.
 */
export async function getIdMandateRole(id: string): Promise<RoleMandates> {
	return (await dfunkAPICall(APIUrls.getIdMandateRole, id)) as RoleMandates;
}
/**
 * Sends an API call to dfunkt.se to get the role and its current mandates, given its id.
 * @param id The role id.
 */
export async function getIdMandateRoleCurrent(
	id: string
): Promise<RoleMandates> {
	return (await dfunkAPICall(
		APIUrls.getIdMandateRoleCurrent,
		id
	)) as RoleMandates;
}
/**
 * Sends an API call to dfunkt.se to get all roles by group ID and all mandates ever on these roles.
 * @param groupid The KTH:id of user.
 */
export async function getRolesByGroupId(groupid: string): Promise<Roles> {
	return (await dfunkAPICall(APIUrls.getRolesByGroupId, groupid)) as Roles;
}
/**
 * Sends an API call to dfunkt.se to get all roles by group ID and all current mandates on these roles.
 * @param groupid The KTH:id of user.
 */
export async function getCurrentRolesByGroupId(
	groupid: string
): Promise<Roles> {
	return (await dfunkAPICall(
		APIUrls.getCurrentRolesByGroupId,
		groupid
	)) as Roles;
}

/**
 * Sends an API call to dfunkt.se to get all roles and their mandates ever.
 */
export async function getAllRoles(): Promise<Roles> {
	return (await dfunkAPICall(APIUrls.getAllRoles, null)) as Roles;
}

/**
 * Sends an API call to dfunkt.se to get all roles and their current mandates.
 */
export async function getAllRolesCurrent(): Promise<Roles> {
	return (await dfunkAPICall(APIUrls.getAllRolesCurrent, null)) as Roles;
}
/**
 * Sends an API call to dfunkt.se to get all users in the dfunkt system ever.
 */
export async function getKthUsers(): Promise<Users> {
	return (await dfunkAPICall(APIUrls.getKthUsers, null)) as Users;
}
/**
 * Sends an API call to dfunkt.se to get a user and their current mandates.
 * @param kthid The KTH:id of user.
 */
export async function getKthUserCurrentMandates(
	kthid: string
): Promise<UserMandates> {
	return (await dfunkAPICall(
		APIUrls.getKthUserCurrentMandates,
		kthid
	)) as UserMandates;
}
/**
 * Sends an API call to dfunkt.se to get a user and all their mandates ever.
 * @param kthid The KTH:id of user.
 */
export async function getKthUserMandates(kthid: string): Promise<UserMandates> {
	return (await dfunkAPICall(
		APIUrls.getKthUserMandates,
		kthid
	)) as UserMandates;
}
/**
 * Sends an API call to dfunkt.se to get a user and their current mandates.
 * @param kthid The KTH:id of user.
 */
export async function getUgkthUserCurrentMandates(
	ugkthid: string
): Promise<UserMandates> {
	return (await dfunkAPICall(
		APIUrls.getUgkthUserCurrentMandates,
		ugkthid
	)) as UserMandates;
}
/**
 * Sends an API call to dfunkt.se to get a user and all their mandates ever.
 * @param kthid The KTH:id of user.
 */
export async function getUgkthUserMandates(
	ugkthid: string
): Promise<UserMandates> {
	return (await dfunkAPICall(
		APIUrls.getUgkthUserMandates,
		ugkthid
	)) as UserMandates;
}
