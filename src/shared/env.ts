// Set default values for some environment variables
export const NODE_ENV = process.env.NODE_ENV || "development";
export const SPAM_URL = process.env.SPAM_URL || "https://spam.datasektionen.se";
export const DATABASE_URL =
	process.env.DATABASE_URL || "postgres://harmony:harmony@db/harmony";
export const DARKMODE_URL =
	process.env.DARKMODE_URL || "https://darkmode.datasektionen.se";

// Configure presets for local testing using nyckeln-under-dorrmattan.
export const LDAP_PROXY_URL = process.env.LDAP_PROXY_URL || "http://nyckeln:7005/user?kthid=";
export const SSO_URL = process.env.SSO_URL || "http://nyckeln:7003/api/users?format=single&u="