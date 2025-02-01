import { tokenUser } from "../../../../database-config";
import * as db from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { clientIsLight } from "../../../../shared/types/light-client";
import { VerifyingUser } from "../../../../shared/types/VerifyingUser";
import {
	setIntisRoles,
	setPingRoles,
	setRoleVerified,
} from "../../../../shared/utils/roles";
import { messageIsToken, verifyUser } from "../util";
import { VerifySubmitVariables } from "./verify-submit.variables";

export async function handleVerifySubmitBase(
	
): Promise<void> {

}

export const handleVerifySubmit = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	await interaction.deferReply({ ephemeral: true });

	const token = interaction.options.getString(
		VerifySubmitVariables.VERIFICATION_CODE,
		true
	);

	if (!messageIsToken(token)) {
		await interaction.editReply({ content: "Not a valid code" });
		return;
	}

	const verifyingUser = (await tokenUser.get(token)) as
		| VerifyingUser
		| undefined;

	if (!verifyingUser || verifyingUser.discordId !== interaction.user.id) {
		await interaction.editReply({
			content:
				"Verification unsuccessful, submit the code again or request a new code.",
		});
		return;
	}

	const kthId = verifyingUser.email.split("@")[0];

	await db.insertUser(kthId, verifyingUser.discordId);

	try {
		if (verifyingUser.isIntis) {
			await Promise.all([
				setRoleVerified(interaction.user, interaction.guild),
				setIntisRoles(interaction.user, interaction.guild),
				setPingRoles(interaction.user, interaction.guild),
			]);
		} else {
			await verifyUser(interaction.user, interaction.guild, kthId);
		}
	} catch (error) {
		console.warn(error);
		await interaction.editReply({
			content: "Something went wrong, please try again.",
		});
		return;
	}

	await tokenUser.delete(token); // Remove temporary token-user pair

	const content = clientIsLight(interaction.client)
		? "You are now verified!"
		: "You are now verified! You have been added to all course channels of your current year. \nYou can join or leave course channels with the `/join` and `/leave` command. \nFor more info, see: <#1020725853157593219>";
	await interaction.editReply({
		content: content,
	});
};
