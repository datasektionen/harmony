import {
	ChatInputCommandInteraction,
	GuildMember,
	GuildMemberManager,
	GuildMemberRoleManager,
} from "discord.js";

const requiredRole = process.env.DISCORD_MOD_ROLE;

export const handleKick = async (interaction: ChatInputCommandInteraction) => {
	const { options } = interaction;
	const role = options.getString("role", true);
	const message = options.getString("message", false);

	// ? Preferably we not even show this command to unauthorized users
	// ? but this is here as a quick-fix and later second line of defense
	if (
		!(interaction.member?.roles as GuildMemberRoleManager).cache.some(
			(current) => current.name === requiredRole
		)
	) {
		return await interaction.reply({
			content: `You need to have the \`${requiredRole}\` role to use this command`,
			ephemeral: true,
		});
	}

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
				current.kick(message ?? "Grattis ettan! Denna server fanns aldrig..."),
			];
		}, [])
	);

	await interaction.reply({
		content: `Kicked all with role \`${role}\` (${targetMembers.size} members)`,
		ephemeral: true,
	});
};
