import { AliasName } from "../alias-mappings";

export function mapYearToAlias(courseYear: number): AliasName {
	const userYear = 2000 + courseYear;
	const year = new Date().getFullYear() - (new Date().getMonth() < 7 ? 1 : 0);
	const currentYear = year - userYear;

	return (
		[AliasName.YEAR1, AliasName.YEAR2, AliasName.YEAR3][currentYear] ??
		AliasName.CS_MASTER
	);
}
