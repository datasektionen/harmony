import env from "../env";

export function verifyNolleCode(code: string): string | undefined {
	switch (code) {
		case env.CODE_A: return env.GROUP_A;
		case env.CODE_B: return env.GROUP_B;
		case env.CODE_D: return env.GROUP_D;
		case env.CODE_E: return env.GROUP_E;
		case env.CODE_C: return env.GROUP_C;
		case env.CODE_F: return env.GROUP_F;
		case env.CODE_G: return env.GROUP_G;
		case env.CODE_H: return env.GROUP_H;
		case env.CODE_I: return env.GROUP_I;
		case env.CODE_J: return env.GROUP_J;
		case env.CODE_K: return env.GROUP_K;
		case env.CODE_L: return env.GROUP_L;
		case env.CODE_M: return env.GROUP_M;
		default: return undefined;
	}
}
