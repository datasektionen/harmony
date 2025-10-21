import { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandNames } from "../commands/commands.names";
import fs from "fs";
import * as path from 'path';
import * as log from "../shared/utils/log";
import { GuildChatInputCommandInteraction } from "../shared/types/GuildChatInputCommandType";
import { CommandNotFoundError } from "../shared/errors/command-not-founder.error";

// Relative path for the configuration file in Docker container.
const relativeConfPath = "../../src/tests/local/testConf.json";

const AcceptedSubcommandHandlerType = "(interaction: GuildChatInputCommandInteraction) => Promise<void>";

type SubCommandConfiguration = {
	subCommand: string;
	subCommandFilePath: string;
	subCommandHandlerName: string;
	subCommandHandlerFilePath: string;
};

const command = new SlashCommandBuilder()
	.setName(CommandNames.TEST)
	.setDescription("Command to execute tests.")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export const testCommand = command;

/**
 * Reads the file `src/tests/local/testConf.json` and parses its content into a **SubCommandConfiguration[]**
 * containing relevant details for the dynamic imports made by the **readMapping** function.
 * @returns A **SubCommandConfiguration[]** type if reading and parsing was successful, **null** otherwise. 
 */
function readConfFile(): SubCommandConfiguration[] | null {
	let subCommandConfig = null;
	// Parse "./local/testConf.json"
	// The file lies in 'app/src/tests/local/testConf.json' in the container, but '__dirname' evaluates to
	// 'app/dist/src/tests', where its `local` directory does not contain any .json files
	const jsonPath = path.resolve(__dirname, relativeConfPath)
	if (fs.existsSync(jsonPath)) {
		try {
			const data = fs.readFileSync(jsonPath, "utf8");
			subCommandConfig = JSON.parse(data) as SubCommandConfiguration[];
		} catch (error) {
			log.error(`Error reading JSON file: ${error}`);
		}
	}
	return subCommandConfig;
}
/**
 * Try to dynamically import a subcommand and its handler by reading a **SubCommandConfiguration** type.
 * Adds the imported subcommand to the `test` command upon successful import. 
 * @param conf The subcommand configuration type containing the details relevant for the dynamic import.
 * @returns a list containing the subcommand and its handler if successful, returns **undefined** otherwise.
 */
async function dynamicImport(conf: SubCommandConfiguration): 
	Promise<[
		SlashCommandSubcommandBuilder, 
		(interaction: GuildChatInputCommandInteraction) => Promise<void>
	] | undefined>  {
	try {
		// At runtime the code is translate into JavaScript thus `.ts` files become `.js` files. The conversion is
		// handled here to spare the user of having to take this into account when writing their testConf.json file.
		const subcommandFilepath = path.join(__dirname, "local", conf.subCommandFilePath.replace(/\.ts$/, ".js"));
		const subcommandHandlerFilepath = path.join(__dirname, "local", conf.subCommandHandlerFilePath.replace(/\.ts$/, ".js"));
		const subCommandFile = await import(subcommandFilepath);
		const subCommandHandlerFile = await import(subcommandHandlerFilepath);
		if (typeof subCommandFile[conf.subCommandHandlerName] !== "function") {
			throw new Error(`${conf.subCommandHandlerName} is not a function, make sure that it is of type ${AcceptedSubcommandHandlerType}`);
		}
		command.addSubcommand(subCommandFile[conf.subCommand]);
		return [subCommandFile[conf.subCommand], subCommandHandlerFile[conf.subCommandHandlerName]]
	} catch (error) {
		log.error(`Error during dynamic import of subcommand: ${error}`);
		return undefined;
	}
}
/**
 * Dynamically import all commands specified in the argument list of parsed **SubCommandConfiguration** types
 * @param subCommandConfig The parsed contents of the `testConf.json` file, assumed to have been successfully parsed.
 * @returns A promise of a **Map** type mapping the names of the subcommands with their handler functions. 
 */
async function readSubcommandMappings(subCommandConfig: SubCommandConfiguration[]): 
		Promise<Map<
		string,
		(interaction: GuildChatInputCommandInteraction) => Promise<void>
		>>		
	{
	// Maps the subcommand's name with its handler
	const subcommandHandlerMapping: Map<
		string,
		(interaction: GuildChatInputCommandInteraction) => Promise<void>
	> = new Map();
	for (const conf of subCommandConfig) {
		if (!conf.subCommand || !conf.subCommandFilePath || !conf.subCommandHandlerFilePath || !conf.subCommandHandlerName) {
			log.error(`Invalid subcommand configuration: ${JSON.stringify(conf)}`);
			continue;
		}
		const subcommandImport = await dynamicImport(conf);
		if (subcommandImport !== undefined) {
			const [subcommand, handler] = subcommandImport;
			subcommandHandlerMapping.set(subcommand.name, handler);
		}
	}
	return subcommandHandlerMapping;
}
/**This map contains mappings between subcommand names and their respective handlers, it is initially 
 * empty but is filled by **initTestCommand**. This map is primarily used by **handleTest**.*/ 
let subcommandHandlerMapping: Map<
		string,
		(interaction: GuildChatInputCommandInteraction) => Promise<void>
	> = new Map();
/**
 * Initializes the `test` command by dynamically importing and loading its subcommands as specified by the user
 * in their local `src/tests/local/testConf.json` file.
 * @returns The amount of loaded `test` subcommands.
 */
export async function initTestCommand(): Promise<number> {
	let amountSubcommands = 0
	const subCommandConfig = readConfFile();
	if (subCommandConfig !== null) {
		subcommandHandlerMapping = await readSubcommandMappings(subCommandConfig);
		amountSubcommands = subcommandHandlerMapping.size;
	}
	return amountSubcommands;
}
/**
 * Given a chat input interaction, try finding its corresponding handler by parsing the command, behaving like a switch-case block.
 * @param interaction The chat input interaction.
 * @returns void
 */
export async function handleTest(
	interaction: GuildChatInputCommandInteraction
): Promise<void> {
	const subcommandName = interaction.options.getSubcommand(true);
	// Read the subcommand handler map for the parsed subcommand name.
	const handler = subcommandHandlerMapping.get(subcommandName);
	if (!handler) { // Subcommand not found
		throw new CommandNotFoundError(`${interaction.commandName} -> ${subcommandName}`);
	}
	await handler(interaction);
}