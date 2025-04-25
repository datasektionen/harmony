import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
// import { TestVariables } from "./test.variables";

export const testCommand = new SlashCommandBuilder()
    .setName(CommandNames.TEST)
    .setDescription("Test dfunkt update (expected for test server).");
