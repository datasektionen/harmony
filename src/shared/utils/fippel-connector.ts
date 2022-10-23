import axios from "axios";

export async function postConnector(
	dc_id: string,
	dc_username: string,
	kth_email: string
) {
	const options = {
		url: "https://harmony-db.datasektionen.se/users",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			token: process.env.FIPPEL_CONNECTOR_API_TOKEN,
			discord_id: dc_id,
			discord_handle: dc_username,
			email: kth_email,
		},
	};
	try {
		await axios(options);
		console.log("Success!");
	} catch (err) {
		console.warn(err);
	}
}
