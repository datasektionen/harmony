import fetch from "node-fetch";

export async function sendMail(to: string, token: string) {
	return await fetch(`${process.env.SPAM_URL}/api/sendmail`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: "no-reply@datasektionen.se",
			to,
			subject: "Discord Verifikation",
			html: `<p>Verifikationskod: ${token}</p>`,
			key: process.env.SPAM_API_TOKEN,
		}),
	});
}