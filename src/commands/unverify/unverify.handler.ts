import { MessageFlags } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { UnverifyVariables } from "./unverify.variables";
import { deleteUser } from "../../db/db";
import { removeRole } from "../../shared/utils/roles";
import * as log from "../../shared/utils/log";

export async function handleUnverify(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const { options } = interaction;
	const user = options.getUser(UnverifyVariables.USER, true);
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	const success = await deleteUser(user.id);

	if (!success) {
		interaction.editReply({
			content:
				"Unverification failed under mysterious circumstances. Contact D-Sys to unverify the user.",
		});
		log.warning("Unverification failed under mysterious circumstances.");
	}

	// And now, remove the verified role on all servers.
	const guilds = interaction.client.guilds.cache;

	Promise.all(
		guilds.map(async (e): Promise<void> => {
			const guild = await e.fetch();
			removeRole(user, "verified", guild);
		})
	);

	interaction.editReply({
		content: `You have successfully unverified user "${user.username}"!`,
	});
	log.info(
		`Successfully unverified user with user.id = "${user.id}", user.username = "${user.username})".`
	);
}
