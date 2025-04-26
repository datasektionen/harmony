import { generateButtons, COURSE_BUTTON_LABELS } from "../util";
import { MessageFlags } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { GuildButtonInteraction } from "../../../../shared/types/GuildButtonInteraction";
import { joinChannel } from "../../../join/join.handler";
import { leaveChannel } from "../../../leave/leave.handler";
import { AliasName } from "../../../../shared/alias-mappings";
import { aliasExists } from "../../../../shared/utils/read-alias-mappings";
import {
	handleChannel,
	handleChannelAlias,
	isMemberOfAlias,
} from "../../../../shared/utils/channel-utils";

export async function handleButtonsCourses(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const labels = COURSE_BUTTON_LABELS.map((alias, index) => {
		// Special formatting for CS and ML master aliases.
		if (index == 3 || index == 4) {
			return (
				alias.charAt(0).toUpperCase() +
				alias.charAt(1).toUpperCase() +
				alias.slice(2)
			);
		} else {
			return alias.charAt(0).toUpperCase() + alias.slice(1);
		}
	});

	await generateButtons(interaction, labels, 3, COURSE_BUTTON_LABELS);
}

export async function handleCourseButtonInteraction(
	interaction: GuildButtonInteraction
): Promise<void> {
	const courseCode = interaction.customId;
	const alias = courseCode as AliasName;
	if (aliasExists(alias)) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const joining = !(await isMemberOfAlias(
			interaction.guild,
			interaction.user.id,
			alias
		));
		const action = joining ? joinChannel : leaveChannel;
		const actionVerb = joining ? "joined" : "left";
		const updateCount = await handleChannelAlias(
			interaction.guild,
			interaction.user,
			alias,
			action
		);

		await interaction.editReply({
			content: `Successfully ${actionVerb} \`${alias}\`! (${updateCount}) channels updated`,
		});
	} else {
		await handleChannel(courseCode, interaction, joinChannel);
	}
}
