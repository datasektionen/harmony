import { DateTime, Duration } from "luxon";

export function getGradeYear(memberYear: number): number {
	return (
		Math.floor(
			(DateTime.now().toMillis() -
				DateTime.fromObject({
					year: memberYear,
					month: 8,
					day: 1,
				}).toMillis()) /
				Duration.fromObject({ years: 1 }).toMillis()
		) + 1
	);
}
