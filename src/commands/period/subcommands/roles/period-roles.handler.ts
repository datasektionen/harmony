import { GuildMember } from "discord.js";
import { DateTime } from "luxon";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { handleChannelAlias } from "../../../../shared/utils/channel-utils";
import { joinChannel } from "../../../join/join.handler";
import { PeriodRolesVariables } from "./period-roles.variables";

export const handlePeriodRoles = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { options } = interaction;
	await interaction.deferReply({ ephemeral: true });
	const period = options.getNumber(PeriodRolesVariables.PERIOD, true);

	// Get guild from interaction
	const guild = interaction.guild;
	// Iterate through all members in guild
	await Promise.all(
		guild.members.cache.map((member) =>
			updateMember(interaction, member, period)
		)
	);
};

async function updateMember(
	interaction: GuildChatInputCommandInteraction,
	member: GuildMember,
	period: number
): Promise<void> {
	const yearString = member?.roles.cache
		.find((role) => role.name.startsWith("D-"))
		?.name.slice(2);

	if (!yearString || isNaN(yearString as unknown as number)) return;
	const year = parseInt(yearString);
	const currentYear = DateTime.now().year;

	// Only manage periods for people in first, second or third year
	if (currentYear - year > 3) return;

	const memberYear = currentYear - year;

	await handleChannelAlias(
		`y${memberYear}p${period}`,
		interaction,
		joinChannel
	);
}
