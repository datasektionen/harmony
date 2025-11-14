import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Guild,
	Message,
	User,
} from "discord.js";
import { UN_ABOOD_BUTTON_CUSTOM_ID } from "../../commands/buttons/subcommands/util";
import { hasRole, setRole } from "./roles";
import * as log from "./log";

const aboodRow = new ActionRowBuilder<ButtonBuilder>();
aboodRow.addComponents(
	new ButtonBuilder()
		.setCustomId(UN_ABOOD_BUTTON_CUSTOM_ID)
		.setLabel("@abood? No, don't ping me!")
		.setStyle(ButtonStyle.Primary)
);

export async function handle_abood_mention(
	message: Message,
	user: User,
	guild: Guild
): Promise<void> {
	const hasRoleAbood = await hasRole(user, "abood", guild);

	if (!hasRoleAbood) {
		await setRole(user, "abood", guild);
		log.info(`Gave role @abood to user ${user.username}`);

		const aboodRow = new ActionRowBuilder<ButtonBuilder>();
		aboodRow.addComponents(
			new ButtonBuilder()
				.setCustomId(UN_ABOOD_BUTTON_CUSTOM_ID + user.id)
				.setLabel("@abood? No thanks!")
				.setStyle(ButtonStyle.Primary)
		);

		await message.reply({
			content: "You have been Abooded!",
			components: [aboodRow],
		});
	}
}
