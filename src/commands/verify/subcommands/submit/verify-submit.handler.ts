import { ChatInputCommandInteraction } from "discord.js";
import {
	tokenDiscord,
	tokenEmail,
	verifiedUsers,
} from "../../../../database-config";
import { setRoleVerified } from "../../../../utils/roles";
import { messageIsToken } from "../util";
import { VerifySubmitVariables } from "./verify-submit.variables";

export const handleVerifySubmit = async (
	interaction: ChatInputCommandInteraction
) => {
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

	verifiedUsers.set(discordId, emailAddress);
	try {
		await setRoleVerified(user);
		await interaction.reply({
			content: `Du är nu verifierad. Dubbelkolla att du har blivit tilldelad @**${process.env.DISCORD_VERIFIED_ROLE}** rollen!`,
			ephemeral: true,
		});
		return;
		// setN0llanRole(user, emailAddress.split("@")[0]);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
		return;
	}
};
