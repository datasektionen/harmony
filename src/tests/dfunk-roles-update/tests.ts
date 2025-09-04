import {
	Guild,
	Client as DiscordClient,
	Collection,
	Role as DiscordRole,
	GuildMember as DiscordGuildMember,
} from "discord.js";
import postgres, { PostgresError } from "postgres";
import { insertUser } from "../../db/db";
import { expectedResults, testCases, testRoles } from "./test_cases";
import { updateDiscordDfunkRoles } from "../../jobs/update-dfunk-roles-get-post";
import { CronJob } from "cron";

const sql = postgres(process.env.DATABASE_URL!, {
	debug: process.env.NODE_ENV === "development",
});
/**
 * Executes a test case from the test case suite defined in **test_cases.ts**, beware of the test cases" expiration date.
 * @param guild Guild to test the update routine on.
 * @param testUserDiscordId Discord ID of user to be test subject.
 * @param testCase A test case, as defined in **test_cases.ts**
 * @param testCaseNr Which test case to execute
 * @returns **true** if the test case was sucessful, **false** otherwise.
 */
export async function executeTestCase(
	guild: Guild,
	testUserDiscordId: string,
	testCase: {
		kthid: string;
		roles: string[];
	},
	testCaseNr: number = 0
): Promise<{
	result: boolean;
	processedDfunkData: {
		currentGroups: Map<string, string[]>;
		specialRoles: [
			{
				roleName: string;
				specialRoleLegibles: Set<string>;
			}
		];
	};
	dbUsers: Map<string, string>;
	discordData: {
		guildRoles: Collection<string, DiscordRole>;
		guildMembers: Collection<string, DiscordGuildMember>;
	};
}> {
	console.log(
		"Test " + testCaseNr + " on Discord user ID " + testUserDiscordId
	);
	console.log(
		"KTH-ID: " + testCase.kthid + "; Initial Roles: " + testCase.roles
	);
	// Setup phase
	let testDiscordMember = await guild.members.fetch({
		user: testUserDiscordId,
		force: true,
	});
	let testUserRoleCache = await testDiscordMember.roles.cache;
	// Remove the test user from the db
	await removeUserFromDb(testUserDiscordId);
	// Reinsert the test user into the db with the new kthid from the test case
	await insertUser(testCase.kthid, testUserDiscordId);
	// Remove all test roles from the user (cleanup from previous test)
	for (const roleName of testRoles) {
		const userRole = await testUserRoleCache.find((role) => role.name === roleName);
		if (userRole !== undefined){
			await testDiscordMember.roles.remove(userRole);
		}
	}
	testDiscordMember = await guild.members.fetch({
		user: testUserDiscordId,
		force: true,
	});
	testUserRoleCache = await testDiscordMember.roles.cache;

	console.log(
		"Initial roles before test setup for user " +
			testDiscordMember.displayName +
			":"
	);
	for (const [, role] of testUserRoleCache) {
		console.log(role.id + " -> " + role.name);
	}
	// Add the roles that are in the test case
	for (const roleName of testCase.roles) {
		const roleToAdd = await testUserRoleCache.find((role) => role.name === roleName);
		if (roleToAdd !== undefined){
			await testDiscordMember.roles.remove(roleToAdd);
		}
	}
	testDiscordMember = await guild.members.fetch({
		user: testUserDiscordId,
		force: true,
	});
	testUserRoleCache = await testDiscordMember.roles.cache;

	console.log(
		"Initial roles after test setup for user " +
			testDiscordMember.displayName +
			":"
	);
	for (const [, role] of testUserRoleCache) {
		console.log(role.id + " -> " + role.name);
	}
	// Execution
	const testResults = await updateDiscordDfunkRoles(guild, true);
	// Evaluation
	testDiscordMember = await guild.members.fetch({
		user: testUserDiscordId,
		force: true,
	});
	testUserRoleCache = await testDiscordMember.roles.cache;
	console.log(
		"Roles for user " +
			testDiscordMember.displayName +
			" after test execution:"
	);
	for (const [, role] of testUserRoleCache) {
		console.log(role.id + " -> " + role.name);
	}
	const expected:
		| { shouldHave: string[]; shouldNotHave: string[] }
		| undefined = expectedResults.get(testCase.kthid);
	if (expected === undefined) {
		console.error("Unexpected error: Error fetching expected test result.");
		console.log("=========================");
		return {
			result: false,
			processedDfunkData: testResults!.processedDfunkData,
			dbUsers: testResults!.dbUsers,
			discordData: testResults!.discordData,
		};
	} else {
		const e = expected;
		const hasAllRolesShouldHave = e.shouldHave.every((roleId) =>
			testUserRoleCache.has(roleId)
		);
		const hasSomeRolesShouldNotHave = e.shouldNotHave.some((roleId) =>
			testUserRoleCache.has(roleId)
		);
		if (!hasAllRolesShouldHave || hasSomeRolesShouldNotHave) {
			if (!hasAllRolesShouldHave)
				console.log(
					"Error in test evaluation, the user (" +
						testCase.kthid +
						") lacks roles they should have."
				);
			if (hasSomeRolesShouldNotHave)
				console.log(
					"Error in test evaluation, the user (" +
						testCase.kthid +
						") has roles they should not have."
				);
			console.log("=========================");
			return {
				result: false,
				processedDfunkData: testResults!.processedDfunkData,
				dbUsers: testResults!.dbUsers,
				discordData: testResults!.discordData,
			};
		} else {
			console.log("Test passed");
			console.log("=========================");
			return {
				result: true,
				processedDfunkData: testResults!.processedDfunkData,
				dbUsers: testResults!.dbUsers,
				discordData: testResults!.discordData,
			};
		}
	}
}
/**
 * Function only intended for test purposes, removes an user from the database with the given Discord ID.
 * @param discordId Discord ID of the user to remove.
 * @returns **true** if removal was successful, **false** otherwise.
 */
async function removeUserFromDb(discordId: string): Promise<boolean> {
	try {
		await sql`delete from users where discord_id = ${discordId}`;
	} catch (err) {
		if (err instanceof PostgresError && err.code == "23505") {
			return false;
		}
		throw err;
	}
	return true;
}

// Cronjob that updates the dfunkt roles on Discord
export const createTestUpdateDfunktRolesJob = (
	client: DiscordClient
): CronJob => {
	let failed: number[] = [];
	let testCaseNumber: number = 0;
	const interval = "* * * * *"; // every minute

	const onTick = async (): Promise<void> => {
		try {
			console.log("\n" + new Date() + ":\n ");
			const guild = await client.guilds.fetch("1212823709706883122"); // Test server
			const testResult = await executeTestCase(
				guild,
				"1013769549398671542",
				testCases[testCaseNumber],
				testCaseNumber + 1
			);
			if (!testResult) failed.push(testCaseNumber + 1);
			testCaseNumber++;
			if (testCaseNumber == testCases.length) {
				console.log("Failed: " + failed);
				testCaseNumber = 0;
				failed = [];
			}
		} catch (e) {
			console.error("CronJob Error:", e);
		}
	};

	const job = new CronJob(interval, onTick, null, true);
	return job;
};

export { updateDiscordDfunkRoles };
