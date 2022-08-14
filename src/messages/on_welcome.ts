import { GuildMember, Message } from "discord.js";

export function onWelcome(member: GuildMember) {
	member.send(
		"Välkommen nØllan! Skriv din KTH-email (<kth-username>@kth.se) nedan."
	);
}
