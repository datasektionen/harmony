export const canBeGivenBy: { [key: string]: string[] } = {
	Näringslivsgruppen: ["Näringslivsansvarig"],
	METAdor: ["Konglig Lokalchef"],
	Prylmångleriet: ["Prylis"],
	Valberedningen: ["Valberedningens ordförande"],
	METAspexet: ["METAspexets Direqteur"],
	dJubileet: ["Jubileumsmarskalk"],
	METAcrafter: ["Herobrine"],
	dJul: ["Tomtemor/-far"],
	Storkuben: ["Qulturattaché", "DESCtop"],
	Announcer: ["dFunk"],
	dFunk: ["D-rek"],
	Titel: ["Storasyskon"],
	Mottagare: ["Titel"],
	Dadderiet: ["Titel"],
	Quisineriet: ["Titel"],
	Ekonomeriet: ["Titel"],
	Doqumenteriet: ["Titel"],
	IOR: ["D-SYS", "Kommunikatör"],
	Studienämnden: ["SNO", "SMA", "JNO", "Programansvarig"],
	dÅke: ["SNO", "SMA", "JNO", "Programansvarig"],
	"D-Dagen": ["D-Dagenansvarig"],
};

/**
 * Checks if a given role is valid.
 * @param role - The role to check.
 * @returns True if the role is valid, false otherwise.
 */
export const isRole = (role: string): boolean => {
	return Object.keys(canBeGivenBy).includes(role) ?? false;
};

/**
 * Checks if a role can be given to another role.
 * @param role The role to check if it can give the target role.
 * @param targetRole The role to check if it can be given by the source role.
 * @returns A boolean indicating whether the role can give the target role.
 */
export const canGiveRole = (role: string, targetRole: string): boolean => {
	return canBeGivenBy[role]?.includes(targetRole) ?? false;
};
