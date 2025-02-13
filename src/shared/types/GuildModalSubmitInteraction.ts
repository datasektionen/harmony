import type { ModalSubmitInteraction, Guild } from "discord.js";

export type GuildModalSubmitInteraction = Omit<
	ModalSubmitInteraction,
	"guild"
> & { guild: Guild };
