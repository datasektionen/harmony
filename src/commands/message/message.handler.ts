import { Snowflake } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handleMessage = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const role = options.getRole("role", true);
	const messageid = options.getString("messageid", false);

	interaction.deferReply({ ephemeral: false });

	const message = await interaction.channel?.messages.fetch(messageid as Snowflake);

	if (!message) {
		interaction.editReply("A message with that ID does not exist in this channel");
		return;
	}

	const text = message.content;

	await interaction.guild.members.fetch();
	const targetMembers = interaction.guild.members.cache.filter(
		(member) =>
			member.roles.cache.some(r => r.name === role.name) && !member.user.bot
	);

	if (!targetMembers) {
		await interaction.editReply("No users with that role found");
		return;
	}

	await Promise.allSettled(
		targetMembers.map(member =>
			member
				.createDM(true)
				.then(dm => dm.send(text))
		)
	);

	await interaction.editReply(
		`Messaged all with role \`${role.name}\` (${targetMembers.size} members)`
	);
};
