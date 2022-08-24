import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export const handleKick = async (interaction: ChatInputCommandInteraction) => {
	const { options } = interaction;
	const role = options.getString("role", true);

	await interaction.guild?.members.fetch();
	const targetMembers = interaction.guild?.members.cache.filter(
		(member) =>
			member.roles.cache.some((r) => r.name === role) && !member.user.bot
	);

	if (!targetMembers) {
		return await interaction.reply({
			content: "No users with that role found",
			ephemeral: true,
		});
	}

	await Promise.allSettled(
		targetMembers.reduce<Promise<GuildMember>[]>((total, current) => {
			return [
				...total,
				current.kick("Grattis ettan! Denna server fanns aldrig..."),
			];
		}, [])
	);

	await interaction.reply({
		content: `Kicked all with role ${role} (${targetMembers.size} members)`,
		ephemeral: true,
	});
};
