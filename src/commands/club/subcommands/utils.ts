export const canBeGivenBy: { [key: string]: string[] } = {
    "Näringslivsgruppen": ['Näringslivsansvarig'],
    "METAdor": ['Konglig lokalansvarig'],
    "Prylmångleriet": ['Prylis'],
    "Valberedningen": ['Valberedningens ordförande'],
    "METAspexet": ['METAspexets Direqteur'],
    "dJubileet": ['Jubileumsmarskalk'],
    "METAcrafter": ['Herobrine'],
    "dJul": ['Tomtemor/-far'],
    "Storkuben": ['Qulturattaché, DESCtop'],
    "Announcer": ['dFunkt'],
    "dFunkt": ['D-rek'],
    "Titel": ['Storasyskon'],
    "Mottagare": ['Titel'],
    "Dadderiet": ['Titel'],
    "Quisineriet": ['Titel'],
    "Ekonomeriet": ['Titel'],
    "Doqumenteriet": ['Titel'],
    "IOR": ['D-Sys', 'Kommunikatör'],
    "Studienämnden": ['SNO', 'SMA', 'JNO', 'Programansvarig'],
    "dÅke": ['SNO', 'SMA', 'JNO', 'Programansvarig']
}

export const isRole = (role: string) => {
    return Object.keys(canBeGivenBy).includes(role);
}

export const canGiveRole = (role: string, target: string) => {
    return canBeGivenBy[role]?.includes(target);
}
