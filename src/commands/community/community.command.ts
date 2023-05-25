import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.names";
import { CommunityVariables } from "./subcommands/community.variables";
import { CommunitySubcommandNames } from "./community-subcommands.names";

export const communityCommand = new SlashCommandBuilder()
	.setName(CommandNames.COMMUNITY)
	.setDescription(
		// Note: General command description is not shown if the command has sub command.
		//       This description is therefore not shown to users.
		"Join or leave a data science community category"
	);

communityCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(CommunitySubcommandNames.JOIN)
		.setDescription("Join a data science community category")
		.addStringOption((option) =>
			option
				.setName(CommunityVariables.COMMUNITY)
				.setDescription("A valid data science community (e.g. D-21, D-22)")
				.setRequired(true)
		)
);

communityCommand.addSubcommand((subcommand) =>
	subcommand
		.setName(CommunitySubcommandNames.LEAVE)
		.setDescription("Leave a data science community category")
		.addStringOption((option) =>
			option
				.setName(CommunityVariables.COMMUNITY)
				.setDescription("A valid data science community (e.g. D-21, D-22)")
				.setRequired(true)
		)
);
