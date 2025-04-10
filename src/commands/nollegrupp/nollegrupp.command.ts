import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands.names";
import { NollegruppSubcommands } from "./nollegrupp-subcommands.names";

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
);

export const nollegruppCommand = command;