import { Snowflake } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handleMessage = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const role = options.getRole("role", true);
	const messageid = options.getString("messageid", false);

	await interaction.deferReply({ ephemeral: true });

	await interaction.guild.members.fetch();
	
	const targetMembers = interaction.guild.members.cache.filter(
		member =>
			member.roles.cache.some(r => r.name === role.name) && !member.user.bot
	);

	if (targetMembers.size === 0) {
		await interaction.editReply("No users with that role found");
		return;
	}

	const message = await interaction.channel?.messages.fetch(messageid as Snowflake)
		.then(message => {
			const content = message.content;
			const files = Array.from(message.attachments.values());
			Promise.allSettled(
				targetMembers.map(member =>
					member
						.createDM(true)
						.then(dm => dm.send({ content, files }))
				)
			);
			return message;
		})
		.catch(() => undefined);
	if (!message) {
		interaction.editReply("A message with that ID does not exist in this channel");
		return;
	}

	await interaction.editReply(
		`Messaged all with role \`${role.name}\` (${targetMembers.size} members)`
	);
};
