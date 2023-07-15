import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]),

	SPAM_URL: z.string(),
	SPAM_API_TOKEN: z.string(),
	DISCORD_BOT_TOKEN: z.string(),
	DISCORD_LIGHT_BOT_TOKEN: z.string().optional(),
	STATE_PATH: z.string().optional(),
	DEFAULT_STATE: z.string().optional(),
	TOKEN_SIZE: z.string().transform(s => parseInt(s)),
	TOKEN_TIMEOUT: z.string().transform(s => parseInt(s)),
	DISCORD_VERIFIED_ROLE: z.string(),
	DISCORD_GUILD_ID: z.string().optional(),

	CODE_A: z.string(),
	CODE_B: z.string(),
	CODE_C: z.string(),
	CODE_D: z.string(),
	CODE_E: z.string(),
	CODE_F: z.string(),
	CODE_G: z.string(),
	CODE_H: z.string(),
	CODE_I: z.string(),
	CODE_J: z.string(),
	CODE_K: z.string(),
	CODE_L: z.string(),
	CODE_M: z.string(),
	CODE_INTIS: z.string(),
	GROUP_A: z.string(),
	GROUP_B: z.string(),
	GROUP_C: z.string(),
	GROUP_D: z.string(),
	GROUP_E: z.string(),
	GROUP_F: z.string(),
	GROUP_G: z.string(),
	GROUP_H: z.string(),
	GROUP_I: z.string(),
	GROUP_J: z.string(),
	GROUP_K: z.string(),
	GROUP_L: z.string(),
	GROUP_M: z.string(),
	GROUP_INTIS: z.string(),

}).refine(env => {
	if (env.NODE_ENV === "production" && !env.DISCORD_LIGHT_BOT_TOKEN)
		throw new Error("You need a token for the light (verification) bot in production");
	if (env.NODE_ENV === "development" && !env.DISCORD_GUILD_ID)
		throw new Error("You need to specify a guild id in development");
});

let env: z.infer<typeof envSchema>;

try {
	env = envSchema.parse(process.env);
} catch (error) {
	console.error(error);
	process.exit(1);
}

export default env;
