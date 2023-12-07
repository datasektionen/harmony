// For each role, list the roles it can give
export const roleCanGive = new Map();
roleCanGive.set("Näringslivsansvarig", ['Näringslivsgruppen']);
roleCanGive.set("Konglig lokalansvarig", ['METAdor']);
roleCanGive.set("Prylis", ['Prylmångleriet']);
roleCanGive.set("Valberedningens ordförande", ['Valberedningen']);
roleCanGive.set("METAspexets Direqteur", ['METAspexet']);
roleCanGive.set("Jubileumsmarskalk", ['dJubileet']);
roleCanGive.set("Herobrine", ['METAcrafter']);
roleCanGive.set("Tomtemor/-far", ['dJul']);
roleCanGive.set("Qulturattaché, DESCtop", ['Storkuben']);
roleCanGive.set("dFunkt", ['Announcer']);
roleCanGive.set("D-rek", ['dFunkt']);
roleCanGive.set("Storasyskon", ['Titel']);
roleCanGive.set("Titel", ['Mottagare', 'Dadderiet', 'Quisineriet', 'Ekonomeriet', 'Doqumenteriet']);
roleCanGive.set("D-Sys", ["IOR"]);
roleCanGive.set("Kommunikatör", ["IOR"]);
roleCanGive.set("SNO", ["Studienämnden", "dÅke"]);
roleCanGive.set("SMA", ["Studienämnden", "dÅke"]);
roleCanGive.set("JNO", ["Studienämnden", "dÅke"]);
roleCanGive.set("Programansvarig", ["Studienämnden", "dÅke"]);


// For each role, list the roles that can give it
export const canBeGivenBy = new Map();
canBeGivenBy.set("Näringslivsgruppen", ['Näringslivsansvarig']);
canBeGivenBy.set("METAdor", ['Konglig lokalansvarig']);
canBeGivenBy.set("Prylmångleriet", ['Prylis']);
canBeGivenBy.set("Valberedningen", ['Valberedningens ordförande']);
canBeGivenBy.set("METAspexet", ['METAspexets Direqteur']);
canBeGivenBy.set("dJubileet", ['Jubileumsmarskalk']);
canBeGivenBy.set("METAcrafter", ['Herobrine']);
canBeGivenBy.set("dJul", ['Tomtemor/-far']);
canBeGivenBy.set("Storkuben", ['Qulturattaché, DESCtop']);
canBeGivenBy.set("Announcer", ['dFunkt']);
canBeGivenBy.set("dFunkt", ['D-rek']);
canBeGivenBy.set("Titel", ['Storasyskon']);
canBeGivenBy.set("Mottagare", ['Titel']);
canBeGivenBy.set("Dadderiet", ['Titel']);
canBeGivenBy.set("Quisineriet", ['Titel']);
canBeGivenBy.set("Ekonomeriet", ['Titel']);
canBeGivenBy.set("Doqumenteriet", ['Titel']);
canBeGivenBy.set("IOR", ['D-Sys', 'Kommunikatör']);
canBeGivenBy.set("Studienämnden", ['SNO', 'SMA', 'JNO', 'Programansvarig']);
canBeGivenBy.set("dÅke", ['SNO', 'SMA', 'JNO', 'Programansvarig']);


export const validRoles = [
    'Näringslivsgruppen',
    'METAdor',
    'Prylmångleriet',
    'Valberedningen',
    'METAspexet',
    'dJubileet',
    'METAcrafter',
    'dJul',
    'Storkuben',
    'Announcer',
    'dFunkt',
    'Titel',
    'Mottagare',
    'Dadderiet',
    'Quisineriet',
    'Ekonomeriet',
    'Doqumenteriet',
    'IOR',
    'Studienämnden',
    'dÅke',
]

export const isRole = (role: string) => {
    return validRoles.includes(role);
}

export const canGiveRole = (role: string, target: string) => {
    return roleCanGive.get(role)?.includes(target);
}
