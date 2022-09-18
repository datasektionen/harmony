import { ChatInputCommandInteraction } from "discord.js";
import {
	tokenDiscord,
	tokenEmail,
	verifiedUsers,
} from "../../../../database-config";
import {  setRoleVerified, setYearRole } from "../../../../shared/utils/roles";
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
			content: `You are now verified! Please check that you have been assigned the **${process.env.DISCORD_VERIFIED_ROLE}** role.`,
			ephemeral: true,
		});
		await setYearRole(user, emailAddress.split("@")[0]);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "Something went wrong, please try again.",
			ephemeral: true,
		});
		return;
	}
};
