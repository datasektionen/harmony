import { MessageFlags } from "discord.js";
import { tokenUser } from "../../../../database-config";
import * as db from "../../../../db/db";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { clientIsLight } from "../../../../shared/types/light-client";
import { VerifyingUser } from "../../../../shared/types/VerifyingUser";
import {
    setDatasektionenRole,
	setIntisRole,
	setPingRoles,
	setRoleVerified,
} from "../../../../shared/utils/roles";
import { messageIsToken, verifyUser } from "../util";
import { VerifySubmitVariables } from "./verify-submit.variables";
import { GuildModalSubmitInteraction } from "../../../../shared/types/GuildModalSubmitInteraction";
import * as log from "../../../../shared/utils/log";

export async function handleVerifySubmitBase(
	interaction: GuildChatInputCommandInteraction | GuildModalSubmitInteraction,
	token: string
): Promise<void> {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	const guild = interaction.guild;

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
				setRoleVerified(interaction.user, guild),
				setIntisRole(interaction.user, guild),
				setDatasektionenRole(interaction.user, guild),
				setPingRoles(interaction.user, guild),
			]);
		} else {
			await verifyUser(
				interaction.user,
				guild,
				kthId,
				clientIsLight(interaction.client)
			);
		}
	} catch (error) {
		log.error(`${error}`);
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
}

export async function handleVerifySubmit(
	interaction: GuildChatInputCommandInteraction | GuildModalSubmitInteraction
): Promise<void> {
	if (interaction.isModalSubmit()) {
		const verificationCode =
			interaction.fields.getTextInputValue("verifySubmitCode");

		await handleVerifySubmitBase(interaction, verificationCode);
	} else if (interaction.isChatInputCommand()) {
		const { options } = interaction;
		const verificationCode = options.getString(
			VerifySubmitVariables.VERIFICATION_CODE,
			true
		);

		await handleVerifySubmitBase(interaction, verificationCode);
	} else {
		log.warning(
			"Unexpected call to handleVerifyNollan(). Origin was neither a slash command, nor a modal submission."
		);
	}
}
