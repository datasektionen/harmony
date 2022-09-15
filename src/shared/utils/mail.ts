import fetch from "node-fetch";

export async function sendMail(to: string, token: string): Promise<unknown> {
	return await fetch(`${process.env.SPAM_URL}/api/sendmail`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: "no-reply@datasektionen.se",
			to,
			subject: "Discord Verification",
			html: `<p>Verification code: ${token}</p>`,
			key: process.env.SPAM_API_TOKEN,
		}),
	});
}
