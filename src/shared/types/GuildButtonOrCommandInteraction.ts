import { GuildChatInputCommandInteraction } from "./GuildChatInputCommandType"
import { GuildButtonInteraction } from "./GuildButtonInteraction"

export type GuildButtonOrCommandInteraction = GuildChatInputCommandInteraction | GuildButtonInteraction
