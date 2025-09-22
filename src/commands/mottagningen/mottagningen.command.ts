import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { MottagningenSubcommands } from "./mottagningen-subcommands.names";

const command = new SlashCommandBuilder()
    .setName(CommandNames.MOTTAGNINGEN)
    .setDescription("Start or end the reception on this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

command.addSubcommand((subCommand) =>
    subCommand
        .setName(MottagningenSubcommands.CLEAR)
        .setDescription("Clear the 'nollan' database table")
);

command.addSubcommand((subCommand) =>
    subCommand
        .setName(MottagningenSubcommands.END)
        .setDescription("End the reception on this server by renaming and reconfiguring channels and roles")
)

export const mottagningenCommand = command;