export function timestamp(): string {
	const now = new Date();
	return (
		now.toLocaleDateString("sv-SE") +
		" " +
		now.toLocaleTimeString("sv-SE") +
		" UTC"
	);
}

export function info(msg: any): void {
	console.log(`${timestamp()} ${msg}`);
}

export function warning(msg: any): void {
	console.warn(`${timestamp()} ${msg}`);
}

export function error(msg: any): void {
	console.error(`${timestamp()} ${msg}`);
}
