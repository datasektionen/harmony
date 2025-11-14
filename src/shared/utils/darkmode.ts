import { DARKMODE_URL } from "../env";

export const isDarkmode = async (): Promise<boolean> => {
	if (DARKMODE_URL === "true") return true;
	if (DARKMODE_URL === "false") return false;

	const response = await fetch(DARKMODE_URL);
	if (!response.ok) return true;
	const darkmode = await response.json();
	return darkmode;
};
