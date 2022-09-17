import base64url from "base64url";
import { randomBytes } from "crypto";

/**
 * Generates a cryptographically secure random, Base64URL-encoded string to be
 * used as a verification token.
 *
 * @param {Integer} size The number of bytes to be generated.
 * @returns {String} the Base64URL-encoded token.
 */
export function generateToken(size: number): string {
	return base64url(randomBytes(size));
}
