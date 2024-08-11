import {
	tokenDiscord,
	tokenEmail,
} from "../../../../database-config";
import * as db from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { messageIsToken, verifyUser } from "../util";
import { VerifySubmitVariables } from "./verify-submit.variables";

export const handleVerifySubmit = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });

	const messageText = interaction.options.getString(
		VerifySubmitVariables.VERIFICATION_CODE,
		true
	);

	if (!messageIsToken(messageText)) {
		await interaction.editReply({ content: "Not a valid code" });
		return;
	}

	const [discordId, emailAddress] = await Promise.all([
		tokenDiscord.get(messageText) as Promise<string | undefined>,
		tokenEmail.get(messageText) as Promise<string | undefined>,
	]);

	if (!emailAddress || !discordId || discordId !== interaction.user.id) {
		await interaction.editReply({
			content: "Verification unsuccessful, submit the code again or request a new code."
		});
		return;
	}

	const kthId = emailAddress.split("@")[0];

	await db.insertUser(kthId, discordId);

	try {
		await verifyUser(interaction.user, interaction.guild, kthId);
	} catch (error) {
		console.warn(error);
		await interaction.editReply({ content: "Something went wrong, please try again." });
		return;
	}

	await interaction.editReply({
		content:
			"You are now verified! You have been added to all course channels of your current year. \nYou can join or leave course channels with the `/join` and `/leave` command. \nFor more info, see: <#1020725853157593219>"
	});
};
