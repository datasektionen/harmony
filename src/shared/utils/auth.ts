import { LDAP_PROXY_URL, SSO_URL } from "../env";
import * as log from "../../shared/utils/log";

type LDAPUser = {
    kthid: string,
    ug_kthid: string,
    first_name: string,
    family_name: string
}

type SSOUser = {
    email: string,
    firstName: string,
    familyName: string,
    yearTag: string
}

type LookupResult = {
    email: string | null,
    ugKthId: string | null,
    kthId: string | null,
    external: boolean,
    yearTag: string | null
}

// Check if a KTH-ID is present in the LDAP database.
export async function ldapLookup(kthId: string): Promise<LDAPUser | null> {
    const response = await fetch(LDAP_PROXY_URL + kthId.toLowerCase());
    switch (response.status) {
        case 200:
            return response.json();
        case 404:
            return null;
        default:
            log.error(`An error occurred when looking up \"${kthId}\" in the LDAP database.\nReceived error message \"${await response.text()}\"`);
            return null;
    }
}

// Check if a KTH-ID is present in the SSO system.
export async function ssoLookup(kthId: string): Promise<SSOUser | null> {
    const response = await fetch(SSO_URL + kthId.toLowerCase());
    switch (response.status) {
        case 200:
            return response.json();
        case 404:
            return null;
        default:
            log.error(`An error occurred when looking up \"${kthId}\" in the SSO database.\nReceived error message \"${await response.text()}\"`);
            return null;
    }
}

// getHodisUser() but better. (And not Hodis.)
export async function lookupUser(kthId: string): Promise<LookupResult | null> {    
    let result: LookupResult = {
        email: null,
        ugKthId: null,
        kthId: null,
        external: true,
        yearTag: null
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
