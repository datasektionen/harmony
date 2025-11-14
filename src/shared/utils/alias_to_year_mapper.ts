import { AliasName } from "../alias-mappings";

export function mapYearToAlias(userYear: number): AliasName | null {
	const year = new Date().getFullYear() - (new Date().getMonth() < 7 ? 1 : 0);

	const current = year - userYear;

	switch (current) {
		case 0:
			return AliasName.YEAR1;
		case 1:
			return AliasName.YEAR2;
		case 2:
			return AliasName.YEAR3;
		default:
			return null;
	}
}
