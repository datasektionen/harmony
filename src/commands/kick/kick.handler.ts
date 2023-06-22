import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handleKick = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const role = options.getRole("role", true);
	const message = options.getString("message", false);

	await interaction.guild.members.fetch();
	const targetMembers = interaction.guild.members.cache.filter(
		(member) =>
			member.roles.cache.some((r) => r.name === role.name) && !member.user.bot
	);

	if (!targetMembers) {
		await interaction.reply({
			content: "No users with that role found.",
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
							"***Tutorial: complete!***\n\n*Det känns som om du vaknat upp från en dröm. Du försöker minnas, men minnena känns hala. 'Något om ett skrymsle?,' säger du till dig själv. Du känner hur minnet försvinner bort, ut i etern. Du viftar på axlarna.*\n\nVälkommen till KTH, *ettan*!\n\nGå med i den officiella Discorden här: <https://dsekt.se/discord>\nDär finns kanaler för alla kurser på programmet, hjälpande assar, information om roliga event och mycket, mycket annat.\n\nVi ses där ettan!"
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
