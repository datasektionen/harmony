export function verifyNolleCode(code: string): string | undefined {
	switch (code) {
		case process.env.CODE_A:
			return process.env.GROUP_A;
		case process.env.CODE_B:
			return process.env.GROUP_B;
		case process.env.CODE_D:
			return process.env.GROUP_D;
		case process.env.CODE_E:
			return process.env.GROUP_E;
		case process.env.CODE_C:
			return process.env.GROUP_C;
		case process.env.CODE_F:
			return process.env.GROUP_F;
		case process.env.CODE_G:
			return process.env.GROUP_G;
		case process.env.CODE_H:
			return process.env.GROUP_H;
		case process.env.CODE_I:
			return process.env.GROUP_I;
		case process.env.CODE_J:
			return process.env.GROUP_J;
		case process.env.CODE_K:
			return process.env.GROUP_K;
		case process.env.CODE_L:
			return process.env.GROUP_L;
		case process.env.CODE_M:
			return process.env.GROUP_M;
		default:
			return undefined;
	}
}
