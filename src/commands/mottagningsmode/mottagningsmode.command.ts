import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CommandNames } from "../commands.names";

export const mottagningsmodeCommand = new SlashCommandBuilder()
    .setName(CommandNames.MOTTAGNINGSMODE)
    .setDescription("Disables mail verification and enables nolle-kod verification")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
