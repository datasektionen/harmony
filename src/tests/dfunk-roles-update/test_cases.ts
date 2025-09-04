/**A subset of all dfunkt roles in Discord which are used for testing.*/
export const testRoles: string[] = [
	"dFunk", // dFunk
	"Ordförande", // Ordförande
	"Bakis", // Bakis
	"D-rek", // D-rek
	"D-NOK", // D-NOK
	"Kommunikatör", // Kommunikatör
	"KF-suppleant", // KF-suppleant // Possibly not implemented in Hive
	"Vice ordförande", // Vice Ordförande
	"dFunkt", // dFunkt
	"Kårfullmäktige", // KF-ledamot // Possibly not implemented in Hive
	"Valberedningen", // Valberedare (Läsår) // Possibly not implemented in Hive
];

/**
 * List of test cases, each represented as an object with a kthid property that specifies the kthid to assign to
 * test Discord user during the test case execution, and a list of Discord role ids representing the roles
 * assigned as setup to the user before the execution.
 *
 * WARNING: These test cases are valid until June 2025.
 */
export const testCases: { kthid: string; roles: string[] }[] = [
	{ kthid: "cwmr", roles: [] },
	{ kthid: "cwmr", roles: ["Kommunikatör"] },
	{ kthid: "cwmr", roles: ["D-NOK", "Kommunikatör"] },
	{ kthid: "dummy", roles: [] },
	{ kthid: "dummy", roles: ["Kommunikatör"] },
	{ kthid: "dummy", roles: ["Valberedningen", "Vice ordförande"] },
	{ kthid: "mrmhm", roles: [] },
	{ kthid: "mrmhm", roles: ["KF-suppleant"] }, // Invalid case, role KF-suppleant (Valberedare (Läsår)) not on Hive
	{
		kthid: "mrmhm",
		roles: [
			"KF-suppleant",
			"D-NOK",
		],
	},
	{ kthid: "mrmhm", roles: ["Kommunikatör"] },
	{ kthid: "mrmhm", roles: ["Kommunikatör", "dFunkt"] },
	{
		kthid: "mrmhm",
		roles: [
			"Kommunikatör",
			"Bakis",
			"Valberedningen",
		],
	},
	{ kthid: "mrmhm", roles: ["dFunk", "Kommunikatör"] },
	{
		kthid: "mrmhm",
		roles: [
			"dFunk",
			"Kommunikatör",
			"Vice ordförande",
		],
	},
	{
		kthid: "mrmhm",
		roles: [
			"dFunk",
			"Kommunikatör",
			"dFunkt",
			"KF-suppleant",
		],
	},
	{ kthid: "olofbm", roles: [] },
	{ kthid: "olofbm", roles: ["Bakis"] },
	{ kthid: "olofbm", roles: ["Kårfullmäktige", "Bakis"] },
	{
		kthid: "olofbm",
		roles: [
			"Kårfullmäktige",
			"Kommunikatör",
			"D-rek",
		],
	},
	{ kthid: "olofbm", roles: ["Valberedningen"] },
	{ kthid: "olofbm", roles: ["Valberedningen", "D-NOK"] },
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"Bakis",
			"D-rek",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"D-rek",
			"Vice ordförande",
			"Bakis",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant"
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant",
			"D-NOK",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant",
			"Kårfullmäktige",
			"D-rek",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant",
			"Kommunikatör",
			"D-NOK",
			"Kårfullmäktige",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant",
			"dFunk",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant",
			"dFunk",
			"Vice ordförande",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant",
			"dFunk",
			"dFunkt",
			"Vice ordförande",
		],
	},
	{
		kthid: "olofbm",
		roles: [
			"Valberedningen",
			"KF-suppleant",
			"dFunk",
			"dFunkt",
			"D-rek",
			"Bakis",
		],
	},
	{ kthid: "sakao", roles: [] },
	{ kthid: "sakao", roles: ["dFunk"] },
	{ kthid: "sakao", roles: ["Vice ordförande", "Bakis"] },
	{ kthid: "sakao", roles: ["D-NOK"] },
	{ kthid: "sakao", roles: ["D-NOK", "Kårfullmäktige"] },
	{
		kthid: "sakao",
		roles: [
			"D-NOK",
			"KF-suppleant",
			"dFunk",
		],
	},
	{ kthid: "sakao", roles: ["D-NOK", "D-rek"] },
	{
		kthid: "sakao",
		roles: [
			"D-NOK",
			"D-rek",
			"Ordförande",
		],
	},
	{
		kthid: "sakao",
		roles: [
			"D-NOK",
			"D-rek",
			"Kommunikatör",
			"dFunkt",
		],
	},
	{ kthid: "sieric", roles: [] },
	{ kthid: "sieric", roles: ["dFunkt"] },
	{ kthid: "sieric", roles: ["D-NOK", "Bakis"] },
	{
		kthid: "sieric",
		roles: [
			"Bakis",
			"KF-suppleant",
			"Valberedningen",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"Ordförande",
			"D-NOK",
			"dFunkt",
			"Kommunikatör",
		],
	},
	{ kthid: "sieric", roles: ["D-rek"] },
	{ kthid: "sieric", roles: ["D-rek", "Bakis"] },
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"Bakis",
			"Kommunikatör",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"KF-suppleant",
			"D-NOK",
			"Ordförande",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"dFunkt",
			"Kommunikatör",
			"Valberedningen",
			"KF-suppleant",
		],
	},
	{ kthid: "sieric", roles: ["Kårfullmäktige", "Vice ordförande"] },
	{
		kthid: "sieric",
		roles: [
			"Kårfullmäktige",
			"Vice ordförande",
			"Bakis",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"Kårfullmäktige",
			"Vice ordförande",
			"D-NOK",
			"dFunkt",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"Kårfullmäktige",
			"Vice ordförande",
			"dFunkt",
			"Bakis",
			"Ordförande",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"Kårfullmäktige",
			"Vice ordförande",
			"Ordförande",
			"D-NOK",
			"Kommunikatör",
			"KF-suppleant",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"KF-suppleant",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"D-NOK",
			"Bakis",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"Valberedningen",
			"Kommunikatör",
			"Ordförande",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"Valberedningen",
			"KF-suppleant",
			"Bakis",
			"dFunkt",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"dFunk",
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"dFunk",
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"dFunkt",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"dFunk",
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"Bakis",
			"KF-suppleant",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"dFunk",
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"Bakis",
			"KF-suppleant",
			"Kommunikatör",
		],
	},
	{
		kthid: "sieric",
		roles: [
			"dFunk",
			"D-rek",
			"Kårfullmäktige",
			"Vice ordförande",
			"Valberedningen",
			"D-NOK",
			"dFunkt",
			"Bakis",
		],
	},
	{ kthid: "asalamon", roles: [] },
	{ kthid: "asalamon", roles: ["D-rek"] },
	{
		kthid: "asalamon",
		roles: ["D-rek", "D-NOK"],
	},
	{ kthid: "asalamon", roles: ["dFunkt"] },
	{
		kthid: "asalamon",
		roles: ["dFunkt", "Vice ordförande"],
	},
	{
		kthid: "asalamon",
		roles: [
			"dFunkt",
			"Kommunikatör",
			"Valberedningen",
		],
	},
];
/**
 * expected results (oracle) for test cases, all test cases with the same kthid property have the same
 * expected result, given as the object in this list with the same kthid as key.
 *
 * WARNING: These test cases are valid until June 2025.
 */
export const expectedResults: Map<
	string,
	{ shouldHave: string[]; shouldNotHave: string[] }
> = new Map([
	[
		"cwmr",
		{
			shouldHave: [],
			shouldNotHave: [
				"Valberedningen",
				"dFunk",
				"Ordförande",
				"Bakis",
				"D-rek",
				"D-NOK",
				"Kommunikatör",
				"KF-suppleant",
				"Vice ordförande",
				"dFunkt",
				"Kårfullmäktige",
			],
		},
	],
	[
		"dummy",
		{
			shouldHave: [],
			shouldNotHave: [
				"Valberedningen",
				"dFunk",
				"Ordförande",
				"Bakis",
				"D-rek",
				"D-NOK",
				"Kommunikatör",
				"KF-suppleant",
				"Vice ordförande",
				"dFunkt",
				"Kårfullmäktige",
			],
		},
	],
	[
		"mrmhm",
		{
			shouldHave: ["dFunk", "Kommunikatör"],
			shouldNotHave: [
				"Valberedningen",
				"Ordförande",
				"Bakis",
				"D-rek",
				"D-NOK",
				"KF-suppleant",
				"Vice ordförande",
				"dFunkt",
				"Kårfullmäktige",
			],
		},
	],
	[
		"olofbm",
		{
			shouldHave: [
				"Valberedningen",
				"Kårfullmäktige",
				"dFunk",
			],
			shouldNotHave: [
				"Ordförande",
				"Bakis",
				"D-rek",
				"D-NOK",
				"Kommunikatör",
				"Vice ordförande",
				"dFunkt",
			],
		},
	],
	[
		"sakao",
		{
			shouldHave: ["D-NOK", "D-rek"],
			shouldNotHave: [
				"Valberedningen",
				"dFunk",
				"Ordförande",
				"Bakis",
				"Kommunikatör",
				"KF-suppleant",
				"Vice ordförande",
				"dFunkt",
				"Kårfullmäktige",
			],
		},
	],
	[
		"sieric",
		{
			shouldHave: [
				"dFunk",
				"D-rek",
				"Kårfullmäktige",
				"Vice ordförande",
			],
			shouldNotHave: [
				"Valberedningen",
				"Ordförande",
				"Bakis",
				"D-NOK",
				"Kommunikatör",
				"KF-suppleant",
				"dFunkt",
			],
		},
	],
	[
		"asalamon",
		{
			shouldHave: ["dFunkt"],
			shouldNotHave: [
				"Valberedningen",
				"dFunk",
				"Ordförande",
				"Bakis",
				"D-rek",
				"D-NOK",
				"Kommunikatör",
				"KF-suppleant",
				"Vice ordförande",
				"Kårfullmäktige",
			],
		},
	],
]);
