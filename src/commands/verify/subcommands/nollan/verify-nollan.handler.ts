import { ModalSubmitInteraction } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { addRolesOrRollback } from "../../../../shared/utils/atomic-roles";
import {
	setRole,
	setN0llanRole,
	hasRoleN0llan,
} from "../../../../shared/utils/roles";
import { verifyNolleCode } from "../../../../shared/utils/verify_nolle_code";
import { VerifyNollanVariables } from "./verify-nollan.variables";

export async function handleVerifyNollanBase(
	interaction: GuildChatInputCommandInteraction | ModalSubmitInteraction,
	nolleKod: string
): Promise<void> {

	let guild = undefined;

	// Verify modals should only exist on the server,
	// so calls via slash command should remain unaffected.
	if (interaction.guild !== null) {
		guild = interaction.guild;
	} else {
		console.warn("Verification failed due to guild being null (/verify nollan has failed).")
		await interaction.editReply({
			content: "Something went wrong, please try again.",
		});
		return;
	}

	const { user } = interaction;
	await interaction.deferReply({ ephemeral: true });

	// Check if nØllan already verified
	if (await hasRoleN0llan(user, guild)) {
		await interaction.editReply({
			content:
				"Du är redan verifierad och schleeemig!\nOm du tror att det skett ett misstag, vänligen kontakta din Dadda.",
		});
		return;
	}

	try {
		// Check if nolle-code is valid
		const validNollegruppRoleName = verifyNolleCode(nolleKod);
		if (!validNollegruppRoleName) {
			await interaction.editReply({
				content:
					"Error: Invalid code!\nVänligen skriv in den personliga kod du fått från din Dadda.\nOm du har problem, kontakta din Dadda!",
			});
			return;
		}

		await addRolesOrRollback(
			user,
			guild,
			async (user, guild) => {
				await setN0llanRole(user, guild);
				await setRole(user, validNollegruppRoleName, guild); // Add n0llegrupp role
			}
		);

		await interaction.editReply({
			content:
				"Välkommen nøllan! Du har nu blivit tillagd i några kanaler, inklusive kanaler för de första kurserna. Ha kul med schlemandet!",
		});
	} catch (error) {
		console.warn(error);
		await interaction.editReply({
			content: "Något gick fel, var vänlig försök igen.",
		});
		return;
	}
}

export async function handleVerifyNollan(
	interaction: GuildChatInputCommandInteraction | ModalSubmitInteraction
): Promise<void> {
	if (interaction.isModalSubmit()) {
		const nolleKod = interaction.fields.getTextInputValue("VerifyNollanNollekod");
	
		await handleVerifyNollanBase(interaction, nolleKod);
	} else {
		const { options } = interaction;
		const nolleKod = options.getString(VerifyNollanVariables.NOLLE_KOD, true);
		
		await handleVerifyNollanBase(interaction, nolleKod);
	}
}