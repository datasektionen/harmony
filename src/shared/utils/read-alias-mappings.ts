import jsYml from "js-yaml";

import { readFileSync } from "fs";

type AlisMappings = {
	[key: string]: string[];
};

export const aliasExists = (alias: string): boolean => {
	return readAliasMappings()[alias] !== undefined;
};

export const getAliasChannels = (alias: string): string[] => {
	return readAliasMappings()[alias];
};

export const readAliasMappings = (): AlisMappings => {
	return jsYml.load(readFileSync("alias-mappings.yml", "utf8")) as AlisMappings;
};
