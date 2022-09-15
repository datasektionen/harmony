import { mappings } from "../alias-mappings";

export const aliasExists = (alias: string): boolean => {
	return mappings[alias] !== undefined;
};

export const getAliasChannels = (alias: string): string[] => {
	return mappings[alias];
};
