// Set default values for some environment variables
export const NODE_ENV = process.env.NODE_ENV || "development";
export const SPAM_URL = process.env.SPAM_URL || "https://spam.datasektionen.se";
export const DATABASE_URL =
	process.env.DATABASE_URL || "postgres://harmony:harmony@db/harmony";
export const DARKMODE_URL =
	process.env.DARKMODE_URL || "https://darkmode.datasektionen.se";
