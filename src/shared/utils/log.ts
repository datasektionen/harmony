export function timestamp(): string {
	const now = new Date();
	return (
		now.toLocaleDateString("sv-SE") +
		" " +
		now.toLocaleTimeString("sv-SE") +
		"." +
		now.getUTCMilliseconds() +
		" UTC"
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function info(...msg: any[]): void {
	console.log(...([timestamp()].concat(...msg)));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function warning(...msg: any[]): void {
	console.warn(...([timestamp()].concat(...msg)));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function error(...msg: any[]): void {
	console.error(...([timestamp()].concat(...msg)));
}
