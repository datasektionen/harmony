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

const dfunktEndpoint: string = "https://dfunkt.datasektionen.se/api/";

/**
 * Defines the endpoints of dfunk API, may be expanded if needed with new endpoints.
 * In case a parameterized request is to be made, such as 
 * https://dfunkt.datasektionen.se/api/role/dsys 
 * the '@' is used as placeholder, the such endpoint would be added to this object as 
 * getIdentifierMandateRole: dfunktEndpoint + "role/@"
 */
const APIUrls = {
	getAllRoles: dfunktEndpoint + "roles/all",
};

/**
 * Type representing any data fetched from the dfunk API.
 */
type DfunkInterface =
	| User
	| Role
	| Group
	| Mandate
	| Roles
	| RoleMandates
	| UserMandates
	| Users;

/**
 * Function that executes a fetch query to the dfunk API.
 * @param url The endpoint for the query. May contain '@' signs to represent query parameters.
 * @param arg Optional, parameters for the query, replaces '@' signs in **url**. Has **null** value by
 * default, representing a query without parameters.
 * @returns Fetched data from the dfunk API.
 */
async function dfunkAPICall(
	url: string,
	arg: string | null = null
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
	return (await dfunkAPICall(APIUrls.getAllRoles)) as Roles;
}
