import { ChatInputCommandInteraction } from "discord.js";

export const handleKick = async (
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const role = options.getRole("role", true);
	const message = options.getString("message", false);

	await interaction.guild?.members.fetch();
	const targetMembers = interaction.guild?.members.cache.filter(
		(member) =>
			member.roles.cache.some((r) => r.name === role.name) && !member.user.bot
	);

	if (!targetMembers) {
		await interaction.reply({
			content: "No users with that role found",
			ephemeral: true,
		});
		return;
	}

	await Promise.allSettled(
		targetMembers.map((current) =>
			current
				.createDM(true)
				.then((dm) =>
					dm.send(
						message ??
							"Grattis ettan! Denna server fanns aldrig..., ditt nya hem är nu: https://dsekt.se/discord"
					)
				)
		)
	);

	const result = await Promise.allSettled(
		targetMembers.map((current) =>
			current.kick(message ?? "Grattis ettan! Denna server fanns aldrig...")
		)
	);

	if (result.some((r) => r.status === "rejected")) {
		await interaction.reply({
			content: `Failed to kick some members with role \`${role.name}\` (${targetMembers.size} members)`,
			ephemeral: true,
		});
		return;
	}

	await interaction.reply({
		content: `Kicked all with role \`${role.name}\` (${targetMembers.size} members)`,
		ephemeral: true,
	});
};
