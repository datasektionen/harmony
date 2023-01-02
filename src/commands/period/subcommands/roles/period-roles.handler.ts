import { GuildMember } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { handleChannelAlias } from "../../../../shared/utils/channel-utils";
import { getGradeYear } from "../../../../shared/utils/year";
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
	const regex = /^D-\d{2}$/;
	const yearString = member?.roles.cache
		.find((role) => regex.test(role.name))
		?.name.slice(2);

	if (!yearString || isNaN(yearString as unknown as number)) return;
	const year = parseInt(yearString);

	const memberYear = getGradeYear(year);
	// Only manage periods for people in first, second or third year
	if (memberYear < 1 || memberYear > 3) return;

	await handleChannelAlias(
		`y${memberYear}p${period}`,
		interaction,
		joinChannel
	);
}
