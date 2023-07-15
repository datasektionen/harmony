import { z } from "zod";

const hodisUser = z.object({
	ugKthid: z.string(),
	uid: z.string(),
	cn: z.string(),
	mail: z.string(),
	givenName: z.string(),
	displayName: z.string(),
	year: z.number(),
	tag: z.string(),
});

type HodisUser = z.infer<typeof hodisUser>;

export async function getHodisUser(kthId: string): Promise<HodisUser> {
	const res = await fetch(`https://hodis.datasektionen.se/uid/${kthId.toLowerCase()}`);
	const json = await res.json();
	return hodisUser.parse(json);
}
