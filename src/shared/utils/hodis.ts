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

export async function getHodisUser(kthId: string): Promise<HodisUser | null> {
	const body = await fetch(
		`https://hodis.datasektionen.se/uid/${kthId.toLowerCase()}`
	).then((res) => res.json());
  return "error" in body ? null : body;
}

export async function extractYearFromUser(kthId: string): Promise<{
	yearRole: string | null;
	year: number | null;
}> {
	const hodisUser = await getHodisUser(kthId);
	const yearTag = hodisUser?.tag
		.split(",")
		.find((tag) => tag.match(/^D\d{2}$/i));
	if (yearTag && hodisUser) {
		const yearTagWithDash = `${yearTag
			.slice(0, 1)
			.toUpperCase()}-${yearTag.slice(1)}`;
		return { yearRole: yearTagWithDash, year: hodisUser.year };
	}

	return { year: null, yearRole: null };
}

export async function isDangerOfNollan(kthId: string, darkmode: boolean): Promise<boolean> {
	const { year } = await extractYearFromUser(kthId);
	const potentiallyNollan = !year || year >= new Date().getFullYear();
	return darkmode && potentiallyNollan;
}
