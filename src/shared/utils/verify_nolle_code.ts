import { NollegruppRoles } from "../assets/mottagning/nolle_codes";


export function verifyNolleCode(code: string): string[] | null {
    if (NollegruppRoles.hasOwnProperty(code)) {
        return NollegruppRoles[code];
    }
    return null;
}