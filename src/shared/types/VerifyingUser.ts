export class VerifyingUser {
	email: string;
	discordId: string;
	isIntis: boolean;

	constructor(email: string, discordId: string, isIntis: boolean) {
		this.email = email;
		this.discordId = discordId;
		this.isIntis = isIntis;
	}
}
