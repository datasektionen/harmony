import postgres, { PostgresError } from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
	debug: process.env.NODE_ENV === "development",
});

export async function init(): Promise<void> {
	await sql`
		create table if not exists users (
			kth_id text primary key,
			discord_id text unique not null
		);
	`;
}

export async function insertUser(
	kthId: string,
	discordId: string,
): Promise<boolean> {
	try {
		await sql`insert into users (kth_id, discord_id) values (${kthId}, ${discordId})`;
	} catch (err) {
		if (err instanceof PostgresError && err.code == "23505") {
			// code for unique key violation
			return false;
		}
		throw err;
	}
	return true;
}

export async function getDiscordIdByKthid(
	kthId: string,
): Promise<string | null> {
	const users =
		await sql`select discord_id from users where kth_id = ${kthId}`;
	if (!users.length) return null;
	return users[0].discord_id;
}

export async function getKthIdByUserId(
	discordId: string,
): Promise<string | null> {
	const users =
		await sql`select kth_id from users where discord_id = ${discordId}`;
	if (!users.length) return null;
	return users[0].kth_id;
}
