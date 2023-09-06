export async function sendMail(to: string, token: string): Promise<string> {
	const res = await fetch(`${process.env.SPAM_URL}/api/sendmail`, {
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
	const text = await res.text();
	if (res.status !== 200) {
		throw new Error(`Spam request failed: ${text}`);
	}
	return text;
}
