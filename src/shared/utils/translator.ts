import { Translator } from "deepl-node";

const authKey = process.env.DEEPL_API_KEY;

export const translator =
	authKey === undefined || authKey === "-"
		? undefined
		: new Translator(authKey);
