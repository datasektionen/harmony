import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { UnverifyVariables } from "./unverify.variables";

export const unverifyCommand = new SlashCommandBuilder()
    .setName("unverify")
    .setDescription("Remove a user's verification from HarmonyDB.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

unverifyCommand.addUserOption((option) =>
    option
        .setName(UnverifyVariables.USER)
        .setDescription("A valid user or user ID.")
        .setRequired(true)
)