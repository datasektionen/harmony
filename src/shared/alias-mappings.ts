export enum AliasName {
	YEAR1 = "year1",
	Y1P1 = "y1p1",
	Y1P2 = "y1p2",
	Y1P3 = "y1p3",
	Y1P4 = "y1p4",
	YEAR2 = "year2",
	Y2P1 = "y2p1",
	Y2P2 = "y2p2",
	Y2P3 = "y2p3",
	Y2P4 = "y2p4",
	YEAR3 = "year3",
	Y3P1 = "y3p1",
	Y3P2 = "y3p2",
	Y3P3 = "y3p3",
	Y3P4 = "y3p4",
	YEAR4 = "year4",
	Y4P1 = "y4p1",
	Y4P2 = "y4p2",
	Y4P3 = "y4p3",
	Y4P4 = "y4p4",
	CS_MASTER = "cs-master",
	ALL = "all",
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
	[AliasName.Y1P1]: ["sf1671", "dd1337", "dd1390", "da1600"],
	[AliasName.Y1P2]: ["sf1624", "dd1338", "dd1337", "dd1390", "da1600"],
	[AliasName.Y1P3]: ["sf1625", "dd1338", "dd1390", "dh1623"],
	[AliasName.Y1P4]: ["sf1626", "dd1396", "dd1349", "dd1390"],
	[AliasName.YEAR2]: [
		"dd1351",
		"dd1360",
		"dd1368",
		"dd1369",
		"dd1390",
		"is1500",
		"me1010",
		//"sf1547", GLÖM FÖRFAN INTE ATT LÄGGA TILL DENNA UNDER RÄTT PERIOD
		"sf1935",
		"sf1626",
		"dd1354",
	],
	[AliasName.Y2P1]: ["me1010", "dd1351", "is1500", "dd1390"],
	[AliasName.Y2P2]: ["dd1368", "dd1369", "dd1351", "is1500", "dd1390"],
	[AliasName.Y2P3]: ["dd1360", "sf1626", "dd1354", "dd1369", "dd1390"],
	[AliasName.Y2P4]: ["dd1360", "dd1369", "dd1390", "sf1935"],
	[AliasName.YEAR3]: [
		"al1504",
		"da150x",
		"dd1390",
		"dd2350",
		"id1200",
		"sf1688",
	],
	[AliasName.Y3P1]: ["sf1688", "dd2350", "id1200", "dd1390"],
	[AliasName.Y3P2]: ["al1504", "dd2350", "id1200", "dd1390"],
	[AliasName.Y3P3]: ["da150x", "dd1390"],
	[AliasName.Y3P4]: ["da150x", "dd1390"],
	[AliasName.YEAR4]: [
		"da2210",
		"dd2300",
		"dd2380",
		"dd2395",
		"dd2440",
		"ik2218",
	],
	[AliasName.Y4P1]: ["dd2440", "ik2218", "dd2395", "dd2300", "da2210"],
	[AliasName.Y4P2]: ["dd2380", "da2210", "dd2300"],
	[AliasName.Y4P3]: ["dd2300"],
	[AliasName.Y4P4]: ["dd2300"],
	[AliasName.CS_MASTER]: [
		"da2210",
		"dd2300",
		"dd2380",
		"dd2395",
		"dd2440",
		"ik2218",
	],
	[AliasName.ALL]: [
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
		"dd1351",
		"dd1354",
		"dd1360",
		"dd1368",
		"dd1369",
		"is1500",
		"me1010",
		//"sf1547",
		"sf1935",
		"al1504",
		"da150x",
		"dd2350",
		"id1200",
		"sf1688",
		"da2210",
		"dd2300",
		"dd2380",
		"dd2395",
		"dd2440",
		"ik2218",
	],
};
