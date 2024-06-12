export const isDarkmode = async (): Promise<boolean> => {
	const response = await fetch("https://darkmode.datasektionen.se/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok)
		return true;
	const darkmode = await response.json();
	return darkmode;
}

