// import { testCases } from "../../../tests/dfunkt-roles-update/test_cases";
import { testCases } from "../../tests/dfunkt-roles-update/test_cases";
import { executeTestCase } from "../../tests/dfunkt-roles-update/tests";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
import { Role as DfunktRole } from "../../shared/utils/dfunkt-interfaces";
import { Role as DiscordRole, Collection, GuildMember as DiscordGuildMember } from "discord.js";
export const handleTest = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	// const failed: number[] = [];
	const failedData: Map<
		number, 
		{
			processedDfunktdata: {
        		currentMandates: Map<string, DfunktRole[]>,
        		currentGroups: Map<string, string[]>,
        		dfunktDiscordRoleLegible: Set<string>,
    		},
    		dbUsers: Map<string, string>,
    		discordData: {
        		guildRoles: Collection<string, DiscordRole>,
        		guildMembers: Collection<string, DiscordGuildMember>
			}
			processedDiscordData: {
				toAddToRole: Map<string, string[]>;
				toRemoveFromRole: Map<string, string[]>;
			}
    	}> = new Map();
	for (let index = 0; index < testCases.length; index++) {
		const testResult = await executeTestCase(
			interaction.guild,
			"1013769549398671542",
			testCases[index],
			index + 1
		);
		if (!testResult.result){
			// failed.push(index + 1);
			failedData.set(
				index + 1, 
				{ 
					processedDfunktdata: testResult.processedDfunktdata, 
					dbUsers: testResult.dbUsers,
					discordData: testResult.discordData,
					processedDiscordData: testResult.processedDiscordData,
				}
			)
			break;
		} 
	}
	console.log("Failed test cases: " + Array.from(failedData.keys()).join(", "));
	failedData.forEach(
		(
			caseData: {
				processedDfunktdata: {
					currentMandates: Map<string, DfunktRole[]>,
					currentGroups: Map<string, string[]>,
					dfunktDiscordRoleLegible: Set<string>,
				},
				dbUsers: Map<string, string>,
				discordData: {
					guildRoles: Collection<string, DiscordRole>,
					guildMembers: Collection<string, DiscordGuildMember>,
				},
				processedDiscordData: {
					toAddToRole: Map<string, string[]>,
					toRemoveFromRole: Map<string, string[]>,
				},
			}, 
			caseNumber: number) => {
				console.log("Test case " + caseNumber + ": ");
				console.log(
					"Data from dfunkt:\n" + 
					caseData.processedDfunktdata.currentMandates.forEach(
						(roles: DfunktRole[], kthid: string) => {
							console.log("User with kthid " + kthid + " should have roles: " + roles.map((role: DfunktRole) => role.identifier).join(", "))	
						}
					)
				);
				console.log(
					caseData.processedDfunktdata.currentGroups.forEach(
						(users: string[], group: string) => {
							console.log("The group " + group + " should have users: " + users.join(", "))	
						}
					)
				);
				console.log(
					"The following users should have no current, but previous mandates (dfunkt role elegibles): " +
					Array.from(caseData.processedDfunktdata.dfunktDiscordRoleLegible).join(", ")
				);
				console.log("Users fetched from database: " + Array.from(caseData.dbUsers.keys()).join(", "));
				console.log("Fetched Discord Data: ")
				console.log("Roles fetched:" + caseData.discordData.guildRoles.map(role => role.name).join(", "));
				caseData.discordData.guildRoles.each(role => console.log("Users having " + role.name + ": " + role.members.map(member => member.displayName).join(", ")));
				console.log("Users fetched: " + caseData.discordData.guildMembers.map(member => member.displayName).join(", "));	
				caseData.discordData.guildMembers.each(member => console.log("(Cached) Roles of user " + member.displayName + ": " + member.roles.cache.map(role => role.name).join(", ")));
				caseData.processedDiscordData.toAddToRole.forEach((users, role) => console.log("Add to role " + role + " users: " + users.join(", ")))
				caseData.processedDiscordData.toRemoveFromRole.forEach((users, role) => console.log("Remove from role " + role + " users: " + users.join(", ")))
			}
		)
};
