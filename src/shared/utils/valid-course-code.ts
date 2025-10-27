export const validCourseCode = (courseCode: string): boolean => {
	const courseCodeRegex = /^[a-z]{2}\d{3}[a-z\d]/i;
	return new RegExp(courseCodeRegex).test(courseCode.trim());
};
