export function getGradeYear(memberYear: number): number {
	return (
		Math.floor(
			(Date.now() - new Date(memberYear, 7).valueOf()) /
				(1000 * 60 * 60 * 24 * 365.25),
		) + 1
	);
}
