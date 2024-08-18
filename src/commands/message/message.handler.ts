import { Role, Snowflake } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { MessageVariables } from "./message.variables";

export const handleMessage = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	const role = options.getRole(MessageVariables.ROLE, true) as Role;
	const messageid = options.getString(MessageVariables.MESSAGEID, true);

	await interaction.deferReply({ ephemeral: true });

	await interaction.guild.members.fetch();

	const targetMembers = role.members;

	if (targetMembers.size === 0) {
		await interaction.editReply("No users with that role found");
		return;
	}

	await interaction.channel?.messages.fetch(); // Update cache
	const message = await interaction.channel?.messages
		.fetch(messageid as Snowflake)
		.catch(() => undefined);
	if (!message) {
		interaction.editReply(
			"A message with that ID does not exist in this channel"
		);
		return;
	}

	const content = message.content;
	const files = Array.from(message.attachments.values());
	let numSent = 0;
	let numFailed = 0;

	await Promise.allSettled(
		targetMembers.map(async (member) => {
			try {
				const dm = await member.createDM(true);
				await dm.send({ content, files });
				numSent++;
				await interaction.editReply(`Amount of DMs sent: ${numSent}`);
			} catch (err) {
				console.error(err);
				numFailed++;
			}
		})
	);

	if (numFailed === 0) {
		await interaction.editReply(
			`Messaged all with role \`${role.name}\` (${numSent} members)`
		);
	} else {
		await interaction.editReply(
			`Messaged all with role \`${role.name}\` (${numSent} members succeeded, but ${numFailed} failed)`
		);
	}
};
