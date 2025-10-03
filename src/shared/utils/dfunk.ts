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

import * as log from "../utils/log";

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
		log.error("Error fetching user data:", error);
		throw error;
	}
}
/**
 * Sends an API call to dfunkt.se to get all roles and their mandates ever.
 */
export async function getAllRoles(): Promise<Roles> {
	return (await dfunkAPICall(APIUrls.getAllRoles, null)) as Roles;
}