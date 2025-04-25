// /**
//  * Map dfunkt roles identifiers to the names of corresponding roles in the Discord server
//  */
// export const dfunktToDiscordRoleMappings, Record<string, string> = {
//    ["varbal" ,    ["Vårbalsgeneral"],
//    ["Quapellmastare" ,    ["Quapellmästare"],
//    ["studs-ansvarig" ,    ["Projektledare Studs"],
//    ["projectpride@d.kth.se" ,    ["Projektledare Project Pride",// Why kth mail as identifier?
//    ["dive" ,    ["Projektledare Project Dive"],
//    ["dare-ansvarig" ,    ["dÅre"],
//    ["jubileum-general" ,    ["Jubileumsmarskalk"],
//    ["groda2024" ,    ["Grodförande", '// No such Discord Role in test Server,    ["Grodförande" in the main server
//    ["d-spex-direqteur" ,    ["Direqteur"],
//    ["fanbarare+vice" ,    ["Vice fanbärare"],
//    ["valberedare (K)" ,    ["Valberedningen", '// Conflict with valberedare (L) ,(
//    ["valberedare (L)" ,    ["Valberedningen", '// Conflict with valberedare (K) ,(
//    ["valberedning" ,    ["Valberedningens ordförande"],
//    ["djulkalendernsansvarig" ,    ["Tomtemor/-far"],
//    ["d-sys" ,    ["D-SYS"],
//    ["sma" ,    ["SMA"],
//    ["idrott" ,    ["Sektionsidrottsledare"],
//    ["historiker" ,    ["Sektionshistoriker"],
//    ["sangansvarig" ,    ["Sångledare"],
//    ["qulturattache" ,    [""],
//    ["prylis" ,    ["Prylis"],
//    ["naringsliv" ,    [""],
//    ["d-mulle" ,    ["Mulle/Mullerina"],
//    ["d-lol" ,    ["Ljud- och Ljusansvarig"],
//    ["kormastare" ,    ["Körmästare"],
//    ["lokalchef" ,    ["Konglig Lokalchef"],
//    ["info" ,    ["Kommunikatör"],
//    ["klubbm" ,    ["Klubbmästare"],
//    ["d-kf+supp" ,    ["KF-suppleant"],
//    ["d-kf" ,    ["KF-ledamot"],
//    ["jamlikordf" ,    ["JNO"],
//    ["jmla" ,    ["JMLA"],
//    ["diu" ,    ["Internationell Studentkoordinator"],
//    ["fanbarare" ,    ["Fanbärare"],
//    ["dramaturg" ,    ["dRamaturgen"],
//    ["d-fest" ,    ["D-Fest"],
//    ["desctopen" ,    ["DESCtop"],
//    ["d-dagen" ,    ["D-Dagenansvarig"],
//    ["dad" ,    ["Datas Art Director"],
//    ["chefred" ,    ["Chefredaqtör"],
//    ["bakis" ,    ["Bakis"],
//    ["arkedemon" ,    ["Ärkedemon"],
//    ["ofvermatrona" ,    ["Adas ordförande"],
//    ["vordf" ,    ["Vice ordförande"],
//    ["vkassor" ,    ["Vice kassör"],
//    ["sekr" ,    ["Sekreterare"],
//    ["ordf" ,    ["Ordförande"],
//    ["d-uf" ,    ["D-UF"],
//    ["d-ssf" ,    ["D-SSF"],
//    ["d-sol" ,    ["D-SOL"],
//    ["d-nok" ,    ["D-NOK"],
//    ["kassor" ,    ["Kassör"],
//    ["pas" ,    ["Programansvarig"],
//    ["revisorer" ,    ["Revisor"],
//    ["sno" ,    ["SNO"],
//    ["storebror" ,    ["Storasyskon"],
//    ["talman" ,    ["Talman"],
//    ["vtalman" ,    ["Vice Talman"],
//    ["dAlumn" ,    ["", '//    ["Projektledare dAlumn"?
// };

/**
 * List the id of all Discord roles that represent dFunkt roles 
 */
export const testDiscordDfunktRolesIds : string[] = [
    // For testing purposes
    '1212823709883179058', // dFunk
    '1212823709815930941', // Kassör
    '1212823709799284852', // Ordförande
    '1212823709799284847', // Bakis
    '1212823709723795517', // Vårbalsgeneral
    '1212823709883179063', // D-rek
    '1212823709815930940', // D-NOK
    '1212823709773996046', // Kommunikatör
    '1212823709757345829', // Sektionshistoriker
    '1212823709773996049', // KF-suppleant
    '1212823709799284850', // Vice Ordförande
    '1360305283993305139', // dFunkt
    '1212823709773996050', // KF-ledamot
];

/**
 * "dFunkt" role on Discord.
 */
export const testDiscordDfunktRole = '1360305283993305139';

/**
 * Map dfunkt Discord roles to identifiers of said roles in dfunkt 
 */
export const testDfunktToDiscordRoleMappings: Map<string, string> = new Map([
    // For test purposes
    ["varbal", '1212823709723795517'],
    ["historiker", '1212823709757345829'],
    ["info", '1212823709773996046'],
    ["d-kf+supp", '1212823709773996049'],
    ["d-kf", '1212823709773996050'],
    ["bakis", '1212823709799284847'],
    ["vordf", '1212823709799284850'],
    ["ordf", '1212823709799284852'],
    ["d-nok", '1212823709815930940'],
    ["kassor", '1212823709815930941'],
]);

/**
 * Map dfunkt Discord roles to identifiers of said roles in dfunkt 
 */
export const testDiscordRoleToDfunktMapping: Map<string, string[]> = new Map([
    // For test purposes
    ['1212823709723795517', ['varbal']],
    ['1212823709757345829', ["historiker"]],
    ['1212823709773996046', ["info"]],
    ['1212823709773996049', ["d-kf+supp"]],
    ['1212823709773996050', ["d-kf"]],
    ['1212823709799284847', ["bakis"]],
    ['1212823709799284850', ["vordf"]],
    ['1212823709799284852', ["ordf"]],
    ['1212823709815930940', ["d-nok"]],
    ['1212823709815930941', ["kassor"]],
]);

/**
 * Map dfunkt Discord roles to identifiers of said roles in dfunkt 
 */
export const testDiscordRoleToDfunktGroup: Map<string, string[]> = new Map ([
    // For test purposes
    ['1212823709883179058', ["dfunk", "proj"]],
    ['1212823709883179063', ["drek"]],
]);

export const testDfunktGroupToDiscordRoleMapping: Map<string, string> = new Map([
    // For test purposes
    ["dfunk", '1212823709883179058'],
    ["proj", '1212823709883179058'],
    ["drek", '1212823709883179063'],
]);
