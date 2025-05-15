import { CronJob } from "cron";
// import { testCases } from "../tests/dfunkt-roles-update/test_cases"; // For testing purposes
// import { createTestUpdateDfunktRolesJob} from "../tests/dfunkt-roles-update/tests"; // For testing purposes
import { Client as DiscordClient } from "discord.js";
import { updateDiscordDfunktRoles } from "./update-dfunk-roles-get-post";

export function initJobs(
	client: DiscordClient
): Map<string, { client: DiscordClient; job: CronJob }> {
	// List of all CronJobs to start.
	const jobs: Map<string, { client: DiscordClient; job: CronJob }> =
		new Map();

	// const testUpdateDfunktRolesJob: CronJob<any, any> = createTestUpdateDfunktRolesJob(client); // For testing purposes only
	const updateDfunktRolesJob: CronJob = createUpdateDfunktRolesJob(client);

	// jobs.set("testUpdateDfunktRoles", {client: client, job: testUpdateDfunktRolesJob}); // For testing purposes only
	jobs.set("updateDfunktRoles", {
		client: client,
		job: updateDfunktRolesJob,
	});
	return jobs;
}

/**
 * Create Cronjob that updates the dfunkt roles on Discord.
 * @param client The Discord client (bot) that will be running this CronJob
 * */
const createUpdateDfunktRolesJob = (client: DiscordClient): CronJob => {
	let retryCount = 0;
	let job: CronJob;

	const originalCronTime = "0 0 * * 6"; // Saturday 12:00 AM
	const retryCronTime = "* * * * *"; // every minute

	const onTick = async (): Promise<void> => {
		try {
			const guild = await client.guilds.fetch("687747877736546335"); // Konglig Datasektionen
			await updateDiscordDfunktRoles(guild);
			retryCount = 0; // Reset on success
		} catch (err) {
			console.error("Job error:", err);
			if (retryCount < 5) {
				retryCount++;
				console.log(`Retrying... (${retryCount})`);
				job.stop();
				job = new CronJob(retryCronTime, onTick, null, true);
			} else {
				console.log(
					"Max retries reached. Resetting to original interval."
				);
				retryCount = 0;
				await sendWebHookError(
					"Harmony Error: Error during Discord dfunkt role update. Please take manual action by using the '/dfunkt' command on Discord."
				).then((res) => {
					console.log("Got response:", res);
				});
				job.stop();
				job = createUpdateDfunktRolesJob(client); // recreate the job
				job.start();
			}
		}
	};

	job = new CronJob(originalCronTime, onTick, null, true);
	return job;
};

async function sendWebHookError(message: string): Promise<Response> {
	const headers: Headers = new Headers();
	headers.set("Content-Type", "application/json");
	const response = await fetch(
		"https://mattermost.datasektionen.se/hooks/g6zrwz6r6p8fbjmz8ob1d7iaxw",
		{
			method: "POST",
			headers: headers,
			body: JSON.stringify({
				text: message,
				channel: "uptimerobot",
				username: "harmony",
				icon_url:
					"https://dsekt-assets.s3.amazonaws.com/shield-color-white-delta.png",
			}),
		}
	);
	return response;
}
