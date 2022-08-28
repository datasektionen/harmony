export class CommandNotFoundError extends Error {
	constructor(commandName: string) {
		super(`Command name not found ${commandName}`);
		this.name = "CommandNotFoundError";
		Object.setPrototypeOf(this, CommandNotFoundError.prototype);
	}
}
