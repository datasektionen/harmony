import axios from "axios";

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
	return (await axios.get(`https://hodis.datasektionen.se/uid/${kthId}`))
		.data as HodisUser;
}
