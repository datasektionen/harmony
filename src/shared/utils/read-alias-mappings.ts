import { AliasName, mappings } from "../alias-mappings";

export const aliasExists = (alias: AliasName): boolean => {
	return mappings[alias] !== undefined;
};

export const getAliasChannels = (alias: AliasName): string[] => {
	return mappings[alias].map(current => current.toLowerCase());
};
