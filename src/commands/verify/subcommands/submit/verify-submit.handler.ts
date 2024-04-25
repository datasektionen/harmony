import {
	tokenDiscord,
	tokenEmail,
	verifiedUsers,
} from "../../../../database-config";
import * as db from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { mapYearToAlias } from "../../../../shared/utils/alias_to_year_mapper";
import { handleChannelAlias } from "../../../../shared/utils/channel-utils";
import {
	extractYearFromUser,
	setExternRole,
	setPingRoles,
	setRoleVerified,
	setYearRoles,
} from "../../../../shared/utils/roles";
import { joinChannel } from "../../../join/join.handler";
import { messageIsToken } from "../util";
import { VerifySubmitVariables } from "./verify-submit.variables";

export const handleVerifySubmit = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const { user, options } = interaction;
	const messageText = options.getString(
		VerifySubmitVariables.VERIFICATION_CODE,
		true
	);

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

	const kthId = emailAddress.split("@")[0];

	await db.insertUser(kthId, discordId);
	
	verifiedUsers.set(discordId, emailAddress);
	console.log(`Verified user by kth email. email="${emailAddress}" user.id="${user.id}" user.username="${user.username}"`);
	try {
		await setRoleVerified(user, interaction.guild);
		await interaction.reply({
			content:
				"You are now verified! You have been added to all course channels of your current year. \nYou can join or leave course channels with the `/join` and `/leave` command. \nFor more info, see: <#1020725853157593219>",
			ephemeral: true,
		});
		const { year, yearRole } = await extractYearFromUser(emailAddress);
		if (yearRole && year) {
			await setYearRoles(user, yearRole, interaction.guild);
			const alias = mapYearToAlias(year);
			if (alias) await handleChannelAlias(alias, interaction, joinChannel);
		} else setExternRole(user, interaction.guild);

		// Add all ping roles
		await setPingRoles(user, interaction.guild);
	} catch (error) {
		console.warn(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
		return;
	}
};
