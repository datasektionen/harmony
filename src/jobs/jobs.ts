import { CronJob } from "cron";
// import { testCases } from "../tests/dfunk-roles-update/test_cases"; // For testing purposes
// import { createTestUpdateDfunkRolesJob} from "../tests/dfunk-roles-update/tests"; // For testing purposes
import { Client as DiscordClient } from "discord.js";
import { updateDiscordDfunkRoles } from "./update-dfunk-roles-get-post";

export function initJobs(
	client: DiscordClient
): Map<string, { client: DiscordClient; job: CronJob }> {
	// List of all CronJobs to start.
	const jobs: Map<string, { client: DiscordClient; job: CronJob }> =
		new Map();

	// const testUpdateDfunkRolesJob: CronJob<any, any> = createTestUpdateDfunkRolesJob(client); // For testing purposes only
	const updateDfunkRolesJob: CronJob = createUpdateDfunkRolesJob(client);

	// jobs.set("testUpdateDfunkRoles", {client: client, job: testUpdateDfunkRolesJob}); // For testing purposes only
	jobs.set("updateDfunkRoles", {
		client: client,
		job: updateDfunkRolesJob,
	});
	return jobs;
}

/**
 * Create Cronjob that updates the dfunk roles on Discord.
 * @param client The Discord client (bot) that will be running this CronJob
 * */
const createUpdateDfunkRolesJob = (client: DiscordClient): CronJob => {
	let retryCount = 0;
	let job: CronJob;

	// const originalCronTime = "0 0 * * 6"; // Saturday 12:00 AM

	const originalCronTime = "*/3 * * * *"; // Every 3 minutes
	const retryCronTime = "* * * * *"; // every minute

	const onTick = async (): Promise<void> => {
		try {
			// Execute the update on each guild the bot is in
			// Is it a good idea to always make the bot do this no matter the server it is in?
			// const guild = await client.guilds.fetch("687747877736546335"); // Konglig Datasektionen
			const oAuthGuilds = await client.guilds.fetch();
			for (const [, oAuthGuild] of oAuthGuilds) {
				const guild = await oAuthGuild.fetch();
				await updateDiscordDfunkRoles(guild);
			}
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
					"Harmony Error: Error during Discord dfunk role update. Please take manual action by using the '/dfunk update' command on Discord."
				).then((res) => {
					console.log("Got response:", res);
				});
				job.stop();
				job = createUpdateDfunkRolesJob(client); // recreate the job
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
