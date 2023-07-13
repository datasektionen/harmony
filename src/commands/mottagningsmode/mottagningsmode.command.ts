import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands.names";
import { MottagningsmodeSubcommandNames } from "./mottagningsmode-subcommands.names";

export const mottagningsmodeCommand = new SlashCommandBuilder()
    .setName(CommandNames.MOTTAGNINGSMODE)
    .setDescription("Disables mail verification and enables nolle-kod verification")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

mottagningsmodeCommand.addSubcommand((subcommand) =>
    subcommand
        .setName(MottagningsmodeSubcommandNames.STATUS)
        .setDescription("Displays the current mode (mottagning or default)")
);

mottagningsmodeCommand.addSubcommand((subcommand) =>
    subcommand
        .setName(MottagningsmodeSubcommandNames.ENABLE)
        .setDescription("Enables mottagnings-mode")
);

mottagningsmodeCommand.addSubcommand((subcommand) =>
    subcommand
        .setName(MottagningsmodeSubcommandNames.DISABLE)
        .setDescription("Disables mottagnings-mode")
);