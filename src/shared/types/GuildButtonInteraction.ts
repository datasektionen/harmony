import type { ButtonInteraction, Guild } from "discord.js";

export type GuildButtonInteraction = Omit<ButtonInteraction, "guild"> & {
	guild: Guild;
};
