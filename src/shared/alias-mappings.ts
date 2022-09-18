export enum AliasName {
	YEAR1 = "year1",
	YEAR2 = "year2",
	YEAR3 = "year3",
	CS_MASTER= "cs-master",
}

export const mappings: Record<AliasName, string[]> = {
	[AliasName.YEAR1]: [
		"DA1600",
		"DD1337",
		"DD1338",
		"DD1349",
		"DD1390",
		"DD1396",
		"DH1623",
		"SF1624",
		"SF1625",
		"SF1626",
		"SF1671",
	],
	[AliasName.YEAR2]: [
		"DD1351",
		"DD1360",
		"DD1368",
		"DD1369",
		"DD1390",
		"IS1500",
		"ME1010",
		"SF1547",
		"SF1935",
	],
	[AliasName.YEAR3]: [
		"AL1504",
		"DA150X",
		"DD1390",
		"DD2350",
		"ID1200",
		"SF1688",
	],
	[AliasName.CS_MASTER]: [
		"DA2210",
		"DD2300",
		"DD2380",
		"DD2395",
		"DD2440",
		"IK2218",
	]
};
