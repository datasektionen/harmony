import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { ClubVariables } from "./subcommands/club.variables";
import { ClubSubcommandNames } from "./club-subcommands.names";
import { canBeGivenBy } from "./subcommands/utils";

export const clubCommand = new SlashCommandBuilder()
	.setName(CommandNames.CLUB)
	.setDescription("Give or remove a role from a user");

clubCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(ClubSubcommandNames.GIVE)
		.setDescription("Give a role to a user")
		.addUserOption((option) =>
			option
				.setName(ClubVariables.TARGET)
				.setDescription("The user to give the role to")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName(ClubVariables.ROLE)
				.setDescription("The role to give")
				.setRequired(true)
				.addChoices(
					...Object.keys(canBeGivenBy).map((role) => {
						return {
							name: role,
							value: role,
						};
					}),
				),
		),
);

clubCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(ClubSubcommandNames.REMOVE)
		.setDescription("Remove a role from a user")
		.addUserOption((option) =>
			option
				.setName(ClubVariables.TARGET)
				.setDescription("The user to remove the role from")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName(ClubVariables.ROLE)
				.setDescription("The role to remove")
				.setRequired(true)
				.addChoices(
					...Object.keys(canBeGivenBy).map((role) => {
						return {
							name: role,
							value: role,
						};
					}),
				),
		),
);
