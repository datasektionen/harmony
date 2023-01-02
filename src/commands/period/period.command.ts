import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { PeriodSubcommandNames } from "./period-subcommands.names";
import { PeriodRolesVariables } from "./subcommands/roles/period-roles.variables";

export const periodCommand = new SlashCommandBuilder()
	.setName(CommandNames.PERIOD)
	.setDescription("Update logic for a period");

periodCommand
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.addSubcommand((subcommand) =>
		subcommand
			.setName(PeriodSubcommandNames.ROLES)
			.setDescription("Execute role logic for a period")
			.addNumberOption((option) =>
				option
					.setName(PeriodRolesVariables.PERIOD)
					.setDescription("The period to execute role logic for")
					.setRequired(true)
			)
	);
