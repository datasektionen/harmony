// import { testCases } from "../../../tests/dfunkt-roles-update/test_cases";
import { testCases } from "../../tests/dfunkt-roles-update/test_cases";
import { executeTestCase } from "../../tests/dfunkt-roles-update/tests";
import { GuildChatInputCommandInteraction } from "../../shared/types/GuildChatInputCommandType";
export const handleTest = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	const failed: number[] = [];
	for (let index = 0; index < testCases.length; index++) {
		const testResult = await executeTestCase(
			interaction.guild,
			"1013769549398671542",
			testCases[index],
			index + 1
		);
		if (!testResult) failed.push(index + 1);
	}
	console.log("Failed test cases: " + failed);
};
