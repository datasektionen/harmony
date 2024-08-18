import { Client } from "discord.js";

export class LightClient extends Client {}

export function clientIsLight(client: Client): boolean {
	return client instanceof LightClient;
}
