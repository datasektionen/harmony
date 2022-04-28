import Keyv from "keyv";

// TODO: We probably do not need 3 key-value stores for this if we used some class for this.
const token_email = new Keyv();
const token_discord = new Keyv();
const verified_users = new Keyv();

token_discord.clear();
token_email.clear();

export { token_email, token_discord, verified_users };
