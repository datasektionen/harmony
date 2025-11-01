import { MessageFlags } from "discord.js";
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
import { hasRoleVerified } from "../../../../shared/utils/roles";

export async function handleCourseButtonInteraction(
	interaction: GuildButtonInteraction
): Promise<void> {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	const isVerified: boolean = await hasRoleVerified(
		interaction.user,
		interaction.guild
	);
	if (!isVerified) {
		await interaction.editReply({
			content: "Only verified users can join courses.",
		});
		return;
	}

	const courseCode = interaction.customId;
	const alias = courseCode as AliasName;
	if (aliasExists(alias)) {
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
