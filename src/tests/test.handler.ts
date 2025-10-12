import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";
import { GuildChatInputCommandInteraction } from "../shared/types/GuildChatInputCommandType";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TestSubcommands } from "./test-subcommands";
// import your subcommands here, i.e.
// import { handleFeature } from "./feature/feature-test.handler";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handleTest(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);

	switch (subcommandName) {
		// Make cases for each of your subcommands, i.e.
		// case TestSubcommands.FEATURE:
		//    return await handleFeature(interaction);
		default:
			throw new CommandNotFoundError(interaction.commandName);
	}
}