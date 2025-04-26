import { Translator } from "deepl-node";
import { readFile } from "fs/promises";
import { decode } from "he";

const authKey = process.env.DEEPL_API_KEY;
const glossaryPath = "./assets/glossary.json";

const translator =
	authKey === undefined || authKey === "-"
		? undefined
		: new Translator(authKey);

const glossary = loadGlossary();

export function isTranslationAvailable(): boolean {
	return translator !== undefined;
}

// SV does not support glossaries, so we need to do it manually with tags
export async function translateText(text: string): Promise<string | undefined> {
	if (!isTranslationAvailable()) {
		return undefined;
	}

	for (const [key, value] of Object.entries(await glossary)) {
		const esc_key = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
		const esc_value = value.replace(/</g, ""); // rough but easier
		text = text.replace(
			new RegExp(esc_key, "gi"),
			`<as-is>${esc_value}</as-is>`
		);
	}

	const result = await translator?.translateText(text, "sv", "en-US", {
		formality: "prefer_less",
		tagHandling: "xml",
		outlineDetection: false,
		splittingTags: [],
		ignoreTags: "as-is",
	});

	const unescapeHtmlEntities = (s: string | undefined): string | undefined =>
		s ? decode(s) : s;

	return unescapeHtmlEntities(
		result?.text.replace(/<as-is>([^<]+)<\/as-is>/g, (_, v) => v)
	);
}

async function loadGlossary(): Promise<{ [k: string]: string }> {
	try {
		const data = await readFile(glossaryPath, "utf8");
		const obj =
			JSON.parse(
				data,
				(k, v) =>
					(k === "" && typeof v === "object" && !Array.isArray(v)) ||
					(k === "__as-is" && Array.isArray(v)) ||
					(k !== "" && k !== "__as-is" && typeof v === "string")
						? v
						: undefined // ignore invalid values
			) ?? {};

		for (const term of obj["__as-is"] ?? {}) {
			obj[term] = term;
		}

		delete obj["__as-is"];
		return obj;
	} catch {
		console.warn(
			"WARNING: A translation glossary was provided, but it doesn't exist or has an invalid structure"
		);
		return {};
	}
}
