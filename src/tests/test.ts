import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands/commands.names";
import fs from "fs";
import * as log from "../shared/utils/log";
import { GuildChatInputCommandInteraction } from "../shared/types/GuildChatInputCommandType";
import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";

const conf_path = "./local/testConf.json";

type SubCommmandConfiguration = {
	subCommand: string,
	subCommandFilePath: string,
	subCommandHandlerName: string,
	subCommandHandlerFilePath: string,
}

const command = new SlashCommandBuilder()
	.setName(CommandNames.TEST)
	.setDescription("Command to execute tests.")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

let subCommandConfig = null;

// Parse "./local/testConf.json"
if (fs.existsSync(conf_path)) {
		try {
			const data = fs.readFileSync(conf_path, "utf8");
			subCommandConfig = JSON.parse(data) as SubCommmandConfiguration[]; 
		} catch (error) {
			log.error(`Error reading JSON file: ${error}`);
		
    }
}

// Maps the subcommand's name with its handler
const subcommandHandlerMapping: Map<
	string, 
	(interaction: GuildChatInputCommandInteraction) => Promise<void>
	> = new Map()

export const testSubcommandNames = Array.from(subcommandHandlerMapping.keys());

// Add subcommands and prepare structure for dynamically-create "test" handler
if (subCommandConfig !== null) {
	subCommandConfig.forEach(async (conf) => {
		const subCommandFile = await import(conf.subCommandFilePath);
		const subCommandHandlerFile = await import(conf.subCommandHandlerFilePath);
		command.addSubcommand(subCommandFile[conf.subCommand])
		subcommandHandlerMapping.set(
			subCommandFile[conf.subCommand].name, 
			subCommandHandlerFile[conf.subCommandHandlerName]
		);
	})
}

/**
 * Given a chat input interaction, try finding its corresponding handler by parsing the command, behaving like a switch-case block.
 * @param interaction The chat input interaction.
 * @returns void
 */
async function handleSubcommand(interaction: GuildChatInputCommandInteraction): Promise<void> {

	const subcommandName = interaction.options.getSubcommand(true);
	const handler = subcommandHandlerMapping.get(subcommandName);

	if (!handler) {
		throw new CommandNotFoundError(interaction.commandName);
	}

	await handler(interaction);
}

export async function handleTest(interaction: GuildChatInputCommandInteraction): Promise<void> {
	await handleSubcommand(interaction);
}

export const testCommand = command;
