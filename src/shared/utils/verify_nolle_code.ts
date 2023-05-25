import { NollegruppRoles } from "../assets/mottagning/nolle_codes";

export function verifyNolleCode(code: string): string[] | null {
	if (code in NollegruppRoles) {
		return NollegruppRoles[code];
	}
	return null;
}
