export function timestamp(): string {
	const now = new Date();
	return (
		now.toLocaleDateString("sv-SE") +
		" " +
		now.toLocaleTimeString("sv-SE") +
		" UTC"
	);
}

export function info(msg: string): void {
	console.log(`${timestamp()} ${msg}`);
}

export function warning(msg: string): void {
	console.warn(`${timestamp()} ${msg}`);
}

export function error(msg: string): void {
	console.error(`${timestamp()} ${msg}`);
}
