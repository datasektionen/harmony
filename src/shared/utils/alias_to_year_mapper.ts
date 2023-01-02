import { AliasName } from "../alias-mappings";

export function mapYearToAlias(courseYear: number): AliasName {
	const userYear = 2000 + courseYear;
	const year = new Date().getFullYear() - (new Date().getMonth() < 7 ? 1 : 0);

	const current = year - userYear;

	switch (current) {
		case 0:
			return AliasName.YEAR1;
		case 1:
			return AliasName.YEAR2;
		case 2:
			return AliasName.YEAR3;
	}
	return AliasName.CS_MASTER;
}
