import { GuildMember } from "discord.js";

export function onWelcome(member: GuildMember): void {
	member.send(
		"Välkommen nØllan! Skriv din KTH-email (<kth-username>@kth.se) nedan."
	);
}
