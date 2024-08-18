import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { CommunityVariables } from "./subcommands/community.variables";
import { CommunitySubcommandNames } from "./community-subcommands.names";

export const communityCommand = new SlashCommandBuilder()
	.setName(CommandNames.COMMUNITY)
	.setDescription(
		// Note: General command description is not shown if the command has sub command.
		//       This description is therefore not shown to users.
		"Join or leave a computer science class community channel category"
	);

communityCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(CommunitySubcommandNames.JOIN)
		.setDescription(
			"Join a computer science class community channel category"
		)
		.addStringOption((option) =>
			option
				.setName(CommunityVariables.COMMUNITY)
				.setDescription(
					"A valid computer science community (e.g. D-22, D-23)"
				)
				.setRequired(true)
				.setAutocomplete(true)
		)
);

communityCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(CommunitySubcommandNames.LEAVE)
		.setDescription(
			"Leave a computer science class community channel category"
		)
		.addStringOption((option) =>
			option
				.setName(CommunityVariables.COMMUNITY)
				.setDescription(
					"A valid computer science class community (e.g. D-22, D-23)"
				)
				.setRequired(true)
				.setAutocomplete(true)
		)
);
