import { Guild, MessageFlags } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { UnverifyVariables } from "./unverify.variables";
import { removeRole } from "../../shared/utils/roles";
import * as log from "../../shared/utils/log";
import { deleteUser } from "../../db/db";

export async function handleUnverify(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const { options } = interaction;
	const user = options.getUser(UnverifyVariables.USER, true);
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	// Remove the user from Harmony's database if the command is executed by Harmony, i.e. not the Light bot.
	if (process.env.DISCORD_BOT_TOKEN) {
		const success = await deleteUser(user.id);

		if (!success) {
			await interaction.editReply({
				content: `Failed to remove user with user.id = "${user.id}", user.username = "${user.username}" from HarmonyDB.`,
			});
			log.info(
				`Failed to remove user with user.id = "${user.id}", user.username = "${user.username}" from HarmonyDB.`
			);
		}

		await interaction.editReply({
			content: `Successfully removed user with user.id = "${user.id}", user.username = "${user.username}" from HarmonyDB.`,
		});
		log.info(
			`Successfully removed user with user.id = "${user.id}", user.username = "${user.username}" from HarmonyDB.`
		);
	}

	// And now, remove the verified role on all servers.
	const guilds = interaction.client.guilds.cache;
	let failures: Guild[] = [];

	for (const e of guilds) {
		const guild = await e[1].fetch();
		try {
			await removeRole(user, "verified", guild);
		} catch {
			log.info(
				`Failed to unverify user with user.id = "${user.id}", user.username = "${user.username}" on guild "${guild.name}".`
			);
			failures.push(guild);
		}
	}

	let fmt = "";
	for (const e of failures) {
		fmt += `- ${e.name}\n`;
	}

	await interaction.editReply({
		content:
			`Successfully unverified user with user.id = "${
				user.id
			}", user.username = "${user.username}" on ${
				guilds.size - failures.length
			}/${guilds.size} guilds.\n` +
			`Guilds where unverification has failed are listed below.\n${fmt}Make sure to manually unverify the user on those servers or re-run the command after investigating the issue further.`,
	});
}
