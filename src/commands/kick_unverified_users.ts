import { Message } from "discord.js";
import { discordClient } from "..";

export function kickUnverifiedUsers(message: Message) {
	const guild = discordClient.guilds.cache.get(
		process.env.DISCORD_GUILD_ID as string
	);
	if (!guild)
		throw new Error(
			`Guild ${process.env.DISCORD_GUILD_ID} does not exist on the Server!`
		);

	/* message.channel.send(
		"Members of the server: " +
			guild.members.cache.map((current) => current.user.username).join(", ") +
			" Member count: " +
			guild.memberCount
	); */

	// kick all users that are not verified if they have not been verified within process.env.KICK_UNVERIFIED_AFTER_SECONDS
	const kickAfter =
		Date.now() -
		parseInt(process.env.KICK_UNVERIFIED_AFTER_SECONDS as string) * 1000;
	guild.members.cache
		.filter(
			(member) =>
				!member.roles.cache.has(process.env.DISCORD_VERIFIED_ROLE as string)
		)
		.filter((member) => (member.joinedTimestamp as number) < kickAfter)
		.forEach((member) => {
			message.channel.send(
				`${member.nickname || member.user.username} har blivit kickad!`
			);
			try {
				member.kick("Not verified");
			} catch (error) {
				console.log("Could not kick ", member.user.username, " Error", error);
			}
		});
}
