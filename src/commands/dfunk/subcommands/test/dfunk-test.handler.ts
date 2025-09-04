import { testCases } from "../../../../tests/dfunk-roles-update/test_cases";
import { executeTestCase } from "../../../../tests/dfunk-roles-update/tests";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import {
	Role as DiscordRole,
	Collection,
	GuildMember as DiscordGuildMember,
} from "discord.js";
import { createDfunkDiscordRoles, /*removeDfunkDiscordRoles,*/  } from "../../../../jobs/update-dfunk-roles-get-post"
export const handleDfunkTest = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	// Create dfunk roles in case these are missing
	await createDfunkDiscordRoles(interaction.guild);
	const failedData: Map<
		number,
		{
			processedDfunkData: {
				currentGroups: Map<string, string[]>;
				specialRoles: [
					{
						roleName: string;
						specialRoleLegibles: Set<string>;
					}
				];
			};
			dbUsers: Map<string, string>;
			discordData: {
				guildRoles: Collection<string, DiscordRole>;
				guildMembers: Collection<string, DiscordGuildMember>;
			};
		}
	> = new Map();
	for (let index = 0; index < testCases.length; index++) {
		const testResult = await executeTestCase(
			interaction.guild,
			"1013769549398671542",
			testCases[index],
			index + 1
		);
		if (!testResult.result) {
			failedData.set(index + 1, {
				processedDfunkData: testResult.processedDfunkData,
				dbUsers: testResult.dbUsers,
				discordData: testResult.discordData,
			});
			break;
		}
	}
	console.log(
		"Failed test cases: " + Array.from(failedData.keys()).join(", ")
	);
	failedData.forEach(
		(
			caseData: {
				processedDfunkData: {
					currentGroups: Map<string, string[]>;
					specialRoles: [
						{
							roleName: string;
							specialRoleLegibles: Set<string>;
						}
					];
				};
				dbUsers: Map<string, string>;
				discordData: {
					guildRoles: Collection<string, DiscordRole>;
					guildMembers: Collection<string, DiscordGuildMember>;
				};
			},
			caseNumber: number
		) => {
			console.log("Test case " + caseNumber + ": ");
			console.log(
				caseData.processedDfunkData.currentGroups.forEach(
					(users: string[], group: string) => {
						console.log(
							"The group " +
								group +
								" should have users: " +
								users.join(", ")
						);
					}
				)
			);
			console.log(
				"Users fetched from database: " +
					Array.from(caseData.dbUsers.keys()).join(", ")
			);
			console.log("Fetched Discord Data: ");
			console.log(
				"Roles fetched:" +
					caseData.discordData.guildRoles
						.map((role) => role.name)
						.join(", ")
			);
			caseData.discordData.guildRoles.each((role) =>
				console.log(
					"Users having " +
						role.name +
						": " +
						role.members
							.map((member) => member.displayName)
							.join(", ")
				)
			);
			console.log(
				"Users fetched: " +
					caseData.discordData.guildMembers
						.map((member) => member.displayName)
						.join(", ")
			);
			caseData.discordData.guildMembers.each((member) =>
				console.log(
					"(Cached) Roles of user " +
						member.displayName +
						": " +
						member.roles.cache.map((role) => role.name).join(", ")
				)
			);
		}
	);
};
