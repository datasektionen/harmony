import { testCases } from "../../../../tests/dfunk-roles-update/test_cases";
import { executeTestCase } from "../../../../tests/dfunk-roles-update/tests";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import {
	Role as DiscordRole,
	Collection,
	GuildMember as DiscordGuildMember,
} from "discord.js";
import {
	createDfunkDiscordRoles /*removeDfunkDiscordRoles,*/,
} from "../../../../jobs/update-dfunk-roles";
import * as log from "../../../../shared/utils/log";
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
	log.error(
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
			log.info("Test case " + caseNumber + ": ");
			caseData.processedDfunkData.currentGroups.forEach(
				(users: string[], group: string) => {
					log.info(
						"The group " +
							group +
							" should have users: " +
							users.join(", ")
					);
				}
			)

			log.info(
				"Users fetched from database: " +
					Array.from(caseData.dbUsers.keys()).join(", ")
			);
			log.info("Fetched Discord Data: ");
			log.info(
				"Roles fetched:" +
					caseData.discordData.guildRoles
						.map((role) => role.name)
						.join(", ")
			);
			caseData.discordData.guildRoles.each((role) =>
				log.info(
					"Users having " +
						role.name +
						": " +
						role.members
							.map((member) => member.displayName)
							.join(", ")
				)
			);
			log.info(
				"Users fetched: " +
					caseData.discordData.guildMembers
						.map((member) => member.displayName)
						.join(", ")
			);
			caseData.discordData.guildMembers.each((member) =>
				log.info(
					"(Cached) Roles of user " +
						member.displayName +
						": " +
						member.roles.cache.map((role) => role.name).join(", ")
				)
			);
		}
	);
};
