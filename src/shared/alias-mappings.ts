export enum AliasName {
	YEAR1 = "year1",
	YEAR2 = "year2",
	YEAR3 = "year3",
	CS_MASTER= "cs-master",
}

export const mappings: Record<AliasName, string[]> = {
	[AliasName.YEAR1]: [
		"da1600",
		"dd1337",
		"dd1338",
		"dd1349",
		"dd1390",
		"dd1396",
		"dh1623",
		"sf1624",
		"sf1625",
		"sf1626",
		"sf1671",
	],
	[AliasName.YEAR2]: [
		"dd1351",
		"dd1360",
		"dd1368",
		"dd1369",
		"dd1390",
		"is1500",
		"me1010",
		"sf1547",
		"sf1935",
	],
	[AliasName.YEAR3]: [
		"al1504",
		"da150x",
		"dd1390",
		"dd2350",
		"id1200",
		"sf1688",
	],
	[AliasName.CS_MASTER]: [
		"da2210",
		"dd2300",
		"dd2380",
		"dd2395",
		"dd2440",
		"ik2218",
	]
};
