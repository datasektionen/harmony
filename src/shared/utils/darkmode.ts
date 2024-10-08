export const isDarkmode = async (): Promise<boolean> => {
	const response = await fetch("https://darkmode.datasektionen.se/");
	if (!response.ok) return true;
	const darkmode = await response.json();
	return darkmode;
};
