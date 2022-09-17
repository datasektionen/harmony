export enum AliasName {
	YEAR1 = "year1",
	YEAR2 = "year2",
	YEAR3 = "year3",
}

export const mappings: Record<AliasName, string[]> = {
	[AliasName.YEAR1]: [
		"sf1671",
		"da1600",
		"dd1337",
		"dd1390",
		"sf1624",
		"dd1338",
		"dh1623",
		"sf1625",
		"dd1349",
		"dd1396",
		"sf1626",
	],
	[AliasName.YEAR2]: [
		"dd1390",
		"dd1351",
		"dd1360",
		"dd1368",
		"dd1369",
		"is1500",
		"me1010",
		"sf1547",
		"sf1935",
	],
	[AliasName.YEAR3]: [
		"dd1390",
		"al1504",
		"da150X",
		"dd2350",
		"id1200",
		"sf1688",
	],
};
