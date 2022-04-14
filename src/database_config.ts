import Keyv from "keyv";

// TODO: We probably do not need 3 key-value stores for this if we used some class for this.
const token_email = new Keyv(process.env.DB_URL, { namespace: "token_email" });
const token_discord = new Keyv(process.env.DB_URL, {
	namespace: "token_discord",
});
const verified_users = new Keyv(process.env.DB_URL, {
	namespace: "verified_users",
});

token_discord.clear();
token_email.clear();

export { token_email, token_discord, verified_users };
