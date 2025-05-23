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

	// Initialise table for nØllegrupp variables such as the names and
	// verification codes for all the nØllegrupper during the Reception.
	// Note 'name' corresponds to the nØllegrupp's Discord role.
	await sql`
		create table if not exists nollegrupp (
			name text primary key,
			code text unique not null
		)
	`;
}

export async function insertUser(
	kthId: string,
	discordId: string
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
	kthId: string
): Promise<string | null> {
	const users =
		await sql`select discord_id from users where kth_id = ${kthId}`;
	if (!users.length) return null;
	return users[0].discord_id;
}

export async function getKthIdByUserId(
	discordId: string
): Promise<string | null> {
	const users =
		await sql`select kth_id from users where discord_id = ${discordId}`;
	if (!users.length) return null;
	return users[0].kth_id;
}

// Return true on success, false if the group already exists.
export async function insertNollegrupp(
	name: string,
	code: string
): Promise<boolean> {
	try {
		await sql`insert into nollegrupp (name, code) values (${name}, ${code})`;
	} catch (err) {
		if (err instanceof PostgresError && err.code == "23505") {
			// code for unique key violation
			return false;
		}
		throw err;
	}
	return true;
}

// Return true on success.
export async function deleteNollegrupp(name: string): Promise<boolean> {
	await sql`delete from nollegrupp where name = ${name}`;
	return true;
}

export async function getNollegruppNameByCode(
	code: string
): Promise<string | null> {
	const groups = await sql`select name from nollegrupp where code = ${code}`;
	if (!groups.length) return null;

	// Group names and codes are unique.
	return groups[0].name;
}

export async function getNollegruppCodeByName(
	name: string
): Promise<string | null> {
	const groups = await sql`select code from nollegrupp where name = ${name}`;
	if (!groups.length) return null;

	// Group names and codes are unique.
	return groups[0].code;
}

export async function clearNollegrupper(): Promise<void> {
	await sql`delete from nollegrupp`;
	return;
}

export async function formatNollegruppData(): Promise<string> {
	const rows = await sql`select * from nollegrupp`;

	let output = `Presently, there are ${rows.length} nØllegrupper (name, code):`;

	rows.forEach((item) => {
		output += `\n${item.name}, ${item.code}`;
	});

	return output;
}
