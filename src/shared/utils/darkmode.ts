export const isDarkmode = async (): Promise<boolean> => {
	const response = await fetch("https://darkmode.datasektionen.se/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	const darkmode = await response.json();
	return darkmode;
}

