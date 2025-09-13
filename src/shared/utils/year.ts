export function getGradeYear(memberYear: number): number {
	return (
		Math.floor(
			(Date.now() - new Date(memberYear, 7).valueOf()) /
				(1000 * 60 * 60 * 24 * 365.25)
		) + 1
	);
}

// If it's 2025 it returns D-25, minus subtractYear if specified
export function getCurrentYearRole(subtractYear?: number): string {
	return (
		"D-" +
		(new Date().getFullYear() - (subtractYear || 0)).toString().slice(2)
	);
}
