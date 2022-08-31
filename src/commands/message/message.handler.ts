import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";

export const handleMessage = async (
	interaction: ChatInputCommandInteraction
) => {
	const { options } = interaction;
	const role = options.getRole("role", true);
	const message = options.getString("message", true);

	await interaction.guild?.members.fetch();
	const targetMembers = interaction.guild?.members.cache.filter(
		(member) =>
			member.roles.cache.some((r) => r.name === role.name) && !member.user.bot
	);

	if (!targetMembers) {
		return await interaction.reply({
			content: "No users with that role found",
			ephemeral: true,
		});
	}

	const result = await Promise.allSettled(
		targetMembers.map((member) => member.send(message))
	);

	if (result.some((r) => r.status === "rejected")) {
		await interaction.reply({
			content: `Failed to send message to role \`${role.name}\` (${targetMembers.size} members)`,
			ephemeral: true,
		});
		return;
	}

	await interaction.reply({
		content: `Successfully sent message to role \`${role.name}\` (${targetMembers.size} members)`,
		ephemeral: true,
	});
};
