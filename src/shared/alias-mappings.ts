export enum AliasName {
	YEAR1 = "year1",
	YEAR2 = "year2",
	YEAR3 = "year3",
	TCSCM = "cs-master",
	TMAIM = "ml-master",
	ALL_ELECTIVES = "all-electives",
}

export const roleAliases = new Map<string, string>([
	[AliasName.YEAR1, "Kurser Åk 1"],
	[AliasName.YEAR2, "Kurser Åk 2"],
	[AliasName.YEAR3, "Kurser Åk 3"],
	[AliasName.TCSCM, "CS Master"],
	[AliasName.TMAIM, "ML Master"],
	[AliasName.ALL_ELECTIVES, "All Electives"],
]);

// Old courses mapped to their current counterparts.
export const courseAliases = new Map<string, string>([
	["dd1360", "dd1366"],
	["dd1361", "dd1366"],
	["dd1362", "dd1366"],
	["sf1923", "sf1935"],
	["sf1924", "sf1935"],
	["sf1925", "sf1935"],
	["dd1369", "dd1367"],
	["dh1620", "dh1623"],
]);

export const mappings: Record<AliasName, string[]> = {
	[AliasName.YEAR1]: [
		"da1600",
		"dd1337",
		"dd1338",
		"dd1349",
		"dd1396",
		"dh1623",
		"sf1624",
		"sf1625",
		"sf1626",
		"sf1671",
		"sf0003",
	],
	[AliasName.YEAR2]: [
		"dd1351",
		"dd1366",
		"dd1368",
		"dd1367",
		"is1500",
		"me1010",
		"sf1547",
		"sf1935",
	],
	[AliasName.YEAR3]: ["al1504", "da150x", "dd2350", "id1200", "sf1688"],
	[AliasName.TCSCM]: [
		"da2210",
		"dd2300",
		"dd2380",
		"dd2395",
		"dd2440",
		"ik2218",
		"da231x",
	],
	[AliasName.TMAIM]: [
		"dd2301",
		"da233x",
		"da2205",
		"dd2434",
		"dd2380",
		"dd1420",
	],
	[AliasName.ALL_ELECTIVES]: [], // Custom logic
	// Old course code mappings
	["dd1360" as AliasName]: ["dd1366"],
	["dd1361" as AliasName]: ["dd1366"],
	["dd1362" as AliasName]: ["dd1366"],
	["sf1923" as AliasName]: ["sf1935"],
	["sf1924" as AliasName]: ["sf1935"],
	["sf1925" as AliasName]: ["sf1935"],
	["dd1369" as AliasName]: ["dd1367"],
	["dh1620" as AliasName]: ["dh1623"],
};
