import { ChatInputCommandInteraction } from "discord.js";
import {
	tokenDiscord,
	tokenEmail,
	verifiedUsers,
} from "../../../../database-config";
import { mapYearToAlias } from "../../../../shared/utils/alias_to_year_mapper";
import { handleChannelAlias } from "../../../../shared/utils/channel-utils";
import {
	extractYearFromUser,
	setRoleVerified,
	setYearRoles,
} from "../../../../shared/utils/roles";
import { joinChannel } from "../../../join/join.handler";
import { messageIsToken } from "../util";
import { VerifySubmitVariables } from "./verify-submit.variables";

export const handleVerifySubmit = async (
	interaction: ChatInputCommandInteraction
): Promise<void> => {
	const { user, options } = interaction;
	const messageText = options.getString(
		VerifySubmitVariables.VERIFICATION_CODE,
		true
	);

	if (!interaction.guild) {
		await interaction.reply({
			content: "Something went wrong...",
			ephemeral: true,
		});
		return;
	}

	if (!messageIsToken(messageText)) {
		await interaction.reply({
			content: "Not a valid code",
			ephemeral: true,
		});
		return;
	}

	const [discordId, emailAddress] = await Promise.all([
		tokenDiscord.get(messageText) as Promise<string | undefined>,
		tokenEmail.get(messageText) as Promise<string | undefined>,
	]);

	if (!emailAddress || !discordId || discordId !== user.id) {
		await interaction.reply({
			content:
				"Verification unsuccessful, submit the code again or request a new code.",
			ephemeral: true,
		});
		return;
	}

	verifiedUsers.set(discordId, emailAddress);
	console.log("hello");
	try {
		await setRoleVerified(user, interaction.guild);
		await interaction.reply({
			content: `You are now verified! Please check that you have been assigned the **${process.env.DISCORD_VERIFIED_ROLE}** role.`,
			ephemeral: true,
		});
		const { year, yearRole } = await extractYearFromUser(emailAddress);
		if (yearRole && year) {
			await setYearRoles(user, yearRole, interaction.guild);
			await handleChannelAlias(mapYearToAlias(year), interaction, joinChannel);
		}
	} catch (error) {
		console.warn(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
		return;
	}
};
