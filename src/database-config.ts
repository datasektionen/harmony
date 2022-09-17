import Keyv from "keyv";

// TODO: We probably do not need 3 key-value stores for this if we used some class for this.
const tokenEmail = new Keyv();
const tokenDiscord = new Keyv();
const verifiedUsers = new Keyv();

tokenDiscord.clear();
tokenEmail.clear();

export { tokenEmail, tokenDiscord, verifiedUsers };
