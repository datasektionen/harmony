import { Role, Snowflake } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";

export const handleMessage = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const role = options.getRole("role", true) as Role;
	const messageid = options.getString("messageid", true);

	await interaction.deferReply({ ephemeral: true });

	await interaction.guild.members.fetch();
	
	const targetMembers = role.members;

	if (targetMembers.size === 0) {
		await interaction.editReply("No users with that role found");
		return;
	}

	const message = await interaction.channel?.messages.fetch(messageid as Snowflake)
		.then(message => message) // An error can either result in undefined or an exception
		.catch(() => undefined);
	if (!message) {
		interaction.editReply("A message with that ID does not exist in this channel");
		return;
	}

	const content = message.content;
	const files = Array.from(message.attachments.values());
	await Promise.allSettled(
		targetMembers.map(member =>
			member
				.createDM(true)
				.then(dm => dm.send({ content, files }))
		)
	);

	await interaction.editReply(
		`Messaged all with role \`${role.name}\` (${targetMembers.size} members)`
	);
};
