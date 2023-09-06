type HodisUser = {
	ugKthid: string;
	uid: string;
	cn: string;
	mail: string;
	givenName: string;
	displayName: string;
	year: number;
	tag: string;
};

export async function getHodisUser(kthId: string): Promise<HodisUser> {
	const res = await fetch(`https://hodis.datasektionen.se/uid/${kthId.toLowerCase()}`);
	return (await res.json()) as HodisUser;
}
