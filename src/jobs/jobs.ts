import { CronJob } from "cron";
import { Client as DiscordClient, Guild, DiscordAPIError } from "discord.js";
import { updateDiscordDfunkRoles } from "./update-dfunk-roles";
import * as log from "../shared/utils/log";
import fs from "fs";
import path from "path";

const relativeLogChannelPath = "../../assets/log_channel.txt";
let logChannel = null;
const kongligDatasektionenGuildId = "687747877736546335";

export function initJobs(
	client: DiscordClient
): Map<string, { client: DiscordClient; job: CronJob }> {
	// List of all CronJobs to start.
	const jobs: Map<string, { client: DiscordClient; job: CronJob }> =
		new Map();

	const updateDfunkRolesJob: CronJob = createUpdateDfunkRolesJob(client);

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

	const originalCronTime = "0 0 * * 6"; // Saturday 12:00 AM

	const retryCronTime = "* * * * *"; // every minute

	const onTick = async (): Promise<void> => {
		// Execute the update only on Konglig Datasektionen
		try {
			const guild = await client.guilds.fetch(kongligDatasektionenGuildId);
			try {
				// await updateDiscordDfunkRoles(guild);
				retryCount = 0; // Reset on success
			} catch (err) {
				log.error("Job error:", err);
				if (retryCount < 5) {
					retryCount++;
					log.warning(`Retrying... (${retryCount})`);
					job.stop();
					job = new CronJob(retryCronTime, onTick, null, true);
				} else {
					log.warning(
						"Max retries reached. Resetting to original interval."
					);
					retryCount = 0;
					await reportCronjobError(
						"Harmony Error: Error during Discord dfunk role update. Please take manual action by using the '/dfunk update' command on Discord.",
						guild

					).then((res) => {
						log.info("Got response:", res);
					});
					job.stop();
					job = createUpdateDfunkRolesJob(client); // recreate the job
					job.start();
				}
			}
		} catch (error) {
			if (error instanceof DiscordAPIError && error.code === 10004) {
				console.log(`Job Error: Target guild ${kongligDatasektionenGuildId} does not exist (Unknown Guild).`);
			} else {
				console.error("Job Error: Unexpected error fetching guild:", error);
			}
		}
	};

	job = new CronJob(originalCronTime, onTick, null, false); //  The job is not active by default.
	return job;
};

async function reportCronjobError(message:string, guild: Guild): Promise<void> {
	// Try reading file containing the channel ID of the harmony log channel
	// Try setting the log channel
	const logPath = path.resolve(__dirname, relativeLogChannelPath);
	let channelId = "";
	if (fs.existsSync(logPath)) {
		channelId = fs.readFileSync(logPath, "utf8").trim();
		logChannel = await guild.channels.fetch(channelId);
		if (!logChannel) {
			log.error(`Error loading log channel with ID ${channelId} from file.`);
			return;
		}
	}
	else {
		log.error("Error loading log channel id from file (path not found).")
		return;
	}
	if(logChannel.isTextBased()) {
		try {
			await logChannel.send(message);	
		} catch (error) {
			log.error("Error writing to log channel, did you set the channel with the `/log channel <channel>` command?")
			return;
		}
	}
	else {
		log.error(`The log channel ${logChannel.name} is not a text-based channel.`)
		return;
	}
	return;	
}
