import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands.names";
import { NollegruppSubcommands } from "./nollegrupp-subcommands.names";
import { NollegruppAddVariables } from "./subcommands/add/nollegrupp-add.variables";
import { NollegruppRemoveVariables } from "./subcommands/remove/nollegrupp-remove.variables";

const command = new SlashCommandBuilder()
    .setName(CommandNames.NOLLEGRUPP)
    .setDescription("Manage nØllegrupp roles")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

command.addSubcommand((subCommand) =>
    subCommand
        .setName(NollegruppSubcommands.ADD)
        .setDescription(
            "Add a new nØllegrupp"
        )
        .addStringOption((option) => 
            option
                .setName(NollegruppAddVariables.NAME)
                .setDescription("The name of the nØllegrupp")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName(NollegruppAddVariables.CODE)
                .setDescription("The nØllegrupp's verification code")
                .setRequired(true)
        )
);

command.addSubcommand((subCommand) =>
    subCommand
        .setName(NollegruppSubcommands.LIST)
        .setDescription("List all nØllegrupper")
);

command.addSubcommand((subCommand) =>
    subCommand
        .setName(NollegruppSubcommands.REMOVE)
        .setDescription("Remove a nØllegrupp")
        .addStringOption((option) =>
            option
                .setName(NollegruppRemoveVariables.NAME)
                .setDescription("The nØllegrupp's name")
                .setRequired(true)
        )
);

export const nollegruppCommand = command;