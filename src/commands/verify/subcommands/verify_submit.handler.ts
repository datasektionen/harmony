import { ChatInputCommandInteraction } from "discord.js";
import {
	token_discord,
	token_email,
	verified_users,
} from "../../../database_config";
import { setN0llanRole, setRoleVerified } from "../../../utils/roles";
import { messageIsToken } from "./util";

export const handleVerifySubmit = async (
	interaction: ChatInputCommandInteraction
) => {
	const { user, options } = interaction;
	const messageText = options.getString("verification-code", true);

	if (!messageIsToken(messageText)) {
		await interaction.reply({
			content: "Not a valid code",
			ephemeral: true,
		});
		return;
	}

	const [discordId, emailAddress] = await Promise.all([
		token_discord.get(messageText) as Promise<string | undefined>,
		token_email.get(messageText) as Promise<string | undefined>,
	]);

	if (!emailAddress || !discordId || discordId !== user.id) {
		await interaction.reply({
			content:
				"Verification unsuccessful, submit the code again or request a new code.",
			ephemeral: true,
		});
		return;
	}

	verified_users.set(discordId, emailAddress);
	try {
		await setRoleVerified(user);
		await interaction.reply({
			content: `Du är nu verifierad. Dubbelkolla att du har blivit tilldelad @**${process.env.DISCORD_VERIFIED_ROLE}** rollen!`,
			ephemeral: true,
		});
		// setN0llanRole(user, emailAddress.split("@")[0]);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
	}
	return;
};
