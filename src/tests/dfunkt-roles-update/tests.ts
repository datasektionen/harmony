import { Guild, Client as DiscordClient } from 'discord.js';
import postgres, { PostgresError } from "postgres";
import { insertUser } from '../../db/db';
import { expectedResults, testCases, testRoles } from './test_cases';
import { updateDiscordDfunktRoles } from '../../jobs/update-dfunk-roles-get-post';
import { testDiscordRoleToDfunktMapping } from './test-dfunkt-roles-mapping';
import { CronJob } from 'cron';

const sql = postgres(process.env.DATABASE_URL!, {
	debug: process.env.NODE_ENV === "development",
});
/**
 * Executes a test case from the test case suite defined in **test_cases.ts**, beware of the test cases' expiration date.
 * @param guild Guild to test the update routine on.
 * @param testUserDiscordId Discord ID of user to be test subject.
 * @param testCase A test case, as defined in **test_cases.ts**
 * @param testCaseNr Which test case to execute
 * @returns **true** if the test case was sucessful, **false** otherwise.
 */
export async function executeTestCase(
    guild : Guild,
    testUserDiscordId : string, 
    testCase : {
        kthid : string, 
        roles : string[]
    },
    testCaseNr : number = 0): Promise<boolean>
    {
        console.log("Test " + testCaseNr + " on Discord user ID " + testUserDiscordId);
        console.log("KTH-ID: " + testCase.kthid + "; Initial Roles: " + testCase.roles.map(roleId => testDiscordRoleToDfunktMapping.get(roleId)).filter((roleIdentifier) : roleIdentifier is string[] => roleIdentifier !== undefined));
        // Setup phase
        let testDiscordMember = await guild.members.fetch(testUserDiscordId); 
        let testUserRoleCache = await testDiscordMember.roles.cache;
        // Remove the test user from the db
        await removeUserFromDb(testUserDiscordId);
        // Reinsert the test user into the db with the new kthid from the test case
        await insertUser(testCase.kthid, testUserDiscordId);
        // Remove all test roles from the user (cleanup from previous test)
        for (const roleId of testRoles) { await testDiscordMember.roles.remove(roleId); }
        testDiscordMember = await guild.members.fetch(testUserDiscordId);
        testUserRoleCache = await testDiscordMember.roles.cache;

        console.log("Initial roles before test setup for user " + testDiscordMember.displayName + ":");
        for (const [_, role] of testUserRoleCache) {
            console.log(role.id + " -> " + role.name);
        }
        // Add the roles that are in the test case
        for (const roleId of testCase.roles) { await testDiscordMember.roles.add(roleId); }
        testDiscordMember = await guild.members.fetch(testUserDiscordId);
        testUserRoleCache = await testDiscordMember.roles.cache;

        console.log("Initial roles after test setup for user " + testDiscordMember.displayName + ":");
        for (const [_, role] of testUserRoleCache) {
            console.log(role.id + " -> " + role.name);
        }
        // Execution
        await updateDiscordDfunktRoles(guild, true);
        // Evaluation
        testDiscordMember = await guild.members.fetch(testUserDiscordId);
        testUserRoleCache = await testDiscordMember.roles.cache;
        console.log("Roles for user " + testDiscordMember.displayName + " after test execution:");
        for (const [_, role] of testUserRoleCache) {
            console.log(role.id + " -> " + role.name);
        }
        let expected : {shouldHave : string[], shouldNotHave : string[]} | undefined = expectedResults.get(testCase.kthid);
        if (expected === undefined) { 
            console.error("Unexpected error: Error fetching expected test result.")
            console.log("=========================");
            return false;
        }
        else {
            const e = expected;
            const hasAllRolesShouldHave = e.shouldHave.every(roleId => testUserRoleCache.has(roleId));
            const hasSomeRolesShouldNotHave = e.shouldNotHave.some(roleId => testUserRoleCache.has(roleId));
            if (!hasAllRolesShouldHave || hasSomeRolesShouldNotHave){
                if (!hasAllRolesShouldHave)
                    console.log("Error in test evaluation, the user (" + testCase.kthid + ") lacks roles they should have.");
                if (hasSomeRolesShouldNotHave)
                    console.log("Error in test evaluation, the user (" + testCase.kthid + ") has roles they should not have.");
                console.log("=========================");
                return false;
            }
            else{
                console.log("Test passed");
                console.log("=========================");
                return true;
            }
        }
}
/**
 * Function only intended for test purposes, removes an user from the database with the given Discord ID.
 * @param discordId Discord ID of the user to remove.
 * @returns **true** if removal was successful, **false** otherwise.
 */
async function removeUserFromDb(
    discordId: string
): Promise<boolean> {
    try {
        await sql`delete from users where discord_id = ${discordId}`;
    } catch (err) {
        if (err instanceof PostgresError && err.code == "23505") {
            // code for unique key violation
            return false;
        }
        throw err;
    }
    return true;
}

// Cronjob that updates the dfunkt roles on Discord 
export const createTestUpdateDfunktRolesJob = (client: DiscordClient) => {
    let job: CronJob;
    let failed: number[] = [];
    let testCaseNumber: number = 0;
    const interval = '* * * * *'; // every minute
    
    const onTick = async () => {
        try{
            console.log("\n" + new Date() + ":\n ");
            const guild = await client.guilds.fetch('1212823709706883122'); // Test server
            let testResult = await executeTestCase(guild, '1013769549398671542', testCases[testCaseNumber], testCaseNumber+1);    
                if (!testResult)
                    failed.push(testCaseNumber+1);
            testCaseNumber++;
            if (testCaseNumber == testCases.length){
                console.log("Failed: " + failed);
                testCaseNumber = 0;
                failed = []; 
            }
        } catch (e) {
            console.error("CronJob Error:", e);
        }
    };
    
    job = new CronJob(interval, onTick, null, true);
    return job;
}

export { updateDiscordDfunktRoles };
