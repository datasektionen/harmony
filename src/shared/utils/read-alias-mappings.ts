import { AliasName, mappings } from "../alias-mappings";

export const aliasExists = (alias: AliasName): boolean => {
	return mappings[alias] !== undefined;
};

export const getAliasChannels = (alias: AliasName): Set<string> => {
	return new Set(mappings[alias].map((current) => current.toLowerCase()));
};
