import { UserMandates, RoleMandates, Roles, Users } from "./dfunk-interfaces";

const dfunktEndpoint: string = "https://dfunkt.datasektionen.se/";

/**
 * Sends an API call to dfunkt.se to get all roles as a list of Role objects.
 * @param kthid The KTH:id of user.
 */
export async function getMandateRoles(): Promise<Roles> {
	try {
		const response = await fetch(dfunktEndpoint + "api/roles");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: Roles = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get the role and its mandates, given its identifier.
 * @param identifier The role identifier.
 */
export async function getIdentifierMandateRole(
	identifier: string
): Promise<RoleMandates> {
	try {
		const response = await fetch(dfunktEndpoint + "api/role/" + identifier);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: RoleMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get the role and its mandates, given its identifier.
 * @param identifier The role identifier.
 */
export async function getIdentifierMandateRoleCurrent(
	identifier: string
): Promise<RoleMandates> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/role/" + identifier + "/current"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: RoleMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get the role and its mandates, given its id.
 * @param id The role id.
 */
export async function getIdMandateRole(id: number): Promise<RoleMandates> {
	try {
		const response = await fetch(dfunktEndpoint + "api/role/id/" + id);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: RoleMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get the role and its mandates, given its id.
 * @param id The role id.
 */
export async function getIdMandateRoleCurrent(
	id: number
): Promise<RoleMandates> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/role/id/" + id + "/current"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: RoleMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get all roles by group ID and all mandates ever on these roles.
 * @param groupid The KTH:id of user.
 */
export async function getRolesByGroupId(groupid: string): Promise<Roles> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/roles/type/" + groupid + "/all"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: Roles = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get all roles by group ID and all mandates ever on these roles.
 * @param groupid The KTH:id of user.
 */
export async function getCurrentRolesByGroupId(
	groupid: string
): Promise<Roles> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/roles/type/" + groupid + "/all/current"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: Roles = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get all roles and their mandates ever.
 */
export async function getAllRoles(): Promise<Roles> {
	try {
		const response = await fetch(dfunktEndpoint + "api/roles/all");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: Roles = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get all roles and their current mandates.
 */
export async function getAllRolesCurrent(): Promise<Roles> {
	try {
		const response = await fetch(dfunktEndpoint + "api/roles/all/current");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: Roles = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get all users in the dfunkt system ever. 
 
 */
export async function getKthUsers(): Promise<Users> {
	try {
		const response = await fetch(dfunktEndpoint + "api/users");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: Users = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get a user and their current mandates.
 * @param kthid The KTH:id of user.
 */
export async function getKthUserCurrentMandates(
	kthid: string
): Promise<UserMandates> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/user/kthid/" + kthid + "/current"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: UserMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get a user and all their mandates.
 * @param kthid The KTH:id of user.
 */
export async function getKthUserMandates(kthid: string): Promise<UserMandates> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/user/kthid/" + kthid
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: UserMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get a user and their current mandates.
 * @param kthid The KTH:id of user.
 */
export async function getUgkthUserCurrentMandates(
	ugkthid: string
): Promise<UserMandates> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/user/ugkthid/" + ugkthid + "/current"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: UserMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}

/**
 * Sends an API call to dfunkt.se to get a user and all their mandates.
 * @param kthid The KTH:id of user.
 */
export async function getUgkthUserMandates(
	ugkthid: string
): Promise<UserMandates> {
	try {
		const response = await fetch(
			dfunktEndpoint + "api/user/ugkthid/" + ugkthid
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data: UserMandates = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}
