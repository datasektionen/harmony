export async function getHiveGroups(tagId: string): Promise<HiveTagGroups> {
	const res = await fetch(
		`https://hive.datasektionen.se/api/v1/tagged/${tagId}/groups`,
		{
			method: "get",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.HIVE}`,
			},
		}
	);
	if (res.status !== 200) {
		throw new Error(`Error fetching groups with tag ${tagId}.`);
	}
	const data: HiveTagGroups = await (res.json() as Promise<HiveTagGroups>);
	return data;
}

export async function getHiveGroupMembers(
	groupId: string,
	groupDomain: string
): Promise<string[]> {
	const res = await fetch(
		`https://hive.datasektionen.se/api/v1/group/${groupDomain}/${groupId}/members`,
		{
			method: "get",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.HIVE}`,
			},
		}
	);
	if (res.status !== 200) {
		throw new Error(
			`Error fetching members of group ${groupId} from domain ${groupDomain}.`
		);
	}
	const data: string[] = await (res.json() as Promise<string[]>);
	return data;
}

export type HiveTagGroups = HiveTagGroup[];
export type HiveTagGroup = {
	group_name: string;
	group_id: string;
	group_domain: string;
	tag_content: string;
};
