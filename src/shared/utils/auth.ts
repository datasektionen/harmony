import { LDAP_PROXY_URL, SSO_URL } from "../env";
import * as log from "../../shared/utils/log";
import { Guild, User } from "discord.js";
import {
	setDatasektionenRole,
	setExternRole,
	setPingRoles,
	setRole,
	setRoleVerified,
} from "./roles";
import { AliasName, roleAliases } from "../alias-mappings";

type LDAPUser = {
	kthid: string;
	ug_kthid: string;
	first_name: string;
	family_name: string;
};

type SSOUser = {
	email: string;
	firstName: string;
	familyName: string;
	yearTag: string;
};

export type LookupResult = {
	email: string | null;
	ugKthId: string | null;
	kthId: string | null;
	external: boolean;
	yearTag: string | null;
};

// Check if a KTH-ID is present in the LDAP database.
async function ldapLookup(kthId: string): Promise<LDAPUser | null> {
	const response = await fetch(LDAP_PROXY_URL + kthId.toLowerCase());
	switch (response.status) {
		case 200:
			return response.json();
		case 404:
			return null;
		default:
			log.error(
				`An error occurred when looking up "${kthId}" in the LDAP database.\nReceived error message "${await response.text()}"`
			);
			return null;
	}
}

// Check if a KTH-ID is present in the SSO system.
async function ssoLookup(kthId: string): Promise<SSOUser | null> {
	const response = await fetch(SSO_URL + kthId.toLowerCase());
	switch (response.status) {
		case 200:
			return response.json();
		case 404:
			return null;
		default:
			log.error(
				`An error occurred when looking up "${kthId}" in the SSO database.\nReceived error message "${await response.text()}"`
			);
			return null;
	}
}

// getHodisUser() but better. (And not Hodis.)
export async function lookupUser(kthId: string): Promise<LookupResult | null> {
	const result: LookupResult = {
		email: null,
		ugKthId: null,
		kthId: null,
		external: true,
		yearTag: null,
	};

	const ldapUser = await ldapLookup(kthId);

	// Check if the user is a KTH student.
	if (ldapUser === null) {
		return null;
	}

	result.email = kthId.toLowerCase() + "@kth.se";
	result.ugKthId = ldapUser.ug_kthid;
	result.kthId = kthId.toLowerCase();

	const ssoUser = await ssoLookup(kthId);

	// Check if the user is a chapter member.
	if (ssoUser === null) {
		return result;
	}

	result.external = false;
	result.yearTag = ssoUser.yearTag;

	return result;
}

export function isKthEmail(email: string): boolean {
	return new RegExp(/^[a-zA-Z0-9]+@kth[.]se$/).test(email);
}

export function messageIsToken(messageText: string): RegExpMatchArray | null {
	return messageText.match(/^[a-zA-Z0-9_-]+$/);
}

// Validate that the email is from KTH, i.e. @kth.se.
export async function lookupUserByEmail(
	email: string
): Promise<LookupResult | null> {
	if (isKthEmail(email)) {
		return lookupUser(email.split("@")[0]);
	}

	return null;
}

// Assume DXX or D-XX year tags.
function isYearTag(tag: string): boolean {
	return tag.match(/^D\d{2}$/) !== null || tag.match(/^D-\d{2}$/) !== null;
}

export async function setAliasRole(
	user: User,
	tag: string,
	guild: Guild
): Promise<void> {
	let alias = null;

	if (isYearTag(tag)) {
		let year = 0;

		if (tag.length == 3) {
			year = parseInt(tag.slice(1));
		} else {
			year = parseInt(tag.slice(2));
		}

		year += 2000;

		log.info(`${year}`);

		const date = new Date();
		const difference =
			date.getFullYear() - year - (date.getMonth() < 8 ? 1 : 0);

		switch (difference) {
			case 0:
				alias = AliasName.YEAR1;
				break;
			case 1:
				alias = AliasName.YEAR2;
				break;
			case 2:
				alias = AliasName.YEAR3;
				break;
		}
	}

	if (alias) {
		const aliasRole = roleAliases.get(alias);
		if (aliasRole !== undefined) {
			await setRole(user, aliasRole, guild);
		}
	}
}

// Look up and verify user.
export async function verifyUser(
	user: User,
	guild: Guild,
	kthId: string,
	isLight: boolean
): Promise<void> {
	const lookup = await lookupUser(kthId);

	await setRoleVerified(user, guild);

	log.info(
		`Verified user by kth email. kthid="${kthId}" user.id="${user.id}" user.username="${user.username}"`
	);

	// The light bot only gives @verified, if lookup is null
	// we are unable to determine additional information about the user.
	if (isLight) {
		return;
	} else if (!lookup) {
		await setExternRole(user, guild);
		return;
	}

	// Continue giving the user roles.
	if (lookup.external) {
		await setExternRole(user, guild);
	} else {
		await setDatasektionenRole(user, guild);
		if (lookup.yearTag) {
			try {
				await setRole(user, lookup.yearTag, guild);
			} catch {
				log.warning(
					`Year role "${lookup.yearTag}" does not exist on the server.`
				);
			}
			await setAliasRole(user, lookup.yearTag, guild);
		}
	}

	// Finally, set some default notification roles.
	await setPingRoles(user, guild);
}
