// 
export const NollegruppRoles: { [key: string]: string[] } = {
    Kod1: ["Apfelstrudel","Grupp A"],
    Kod2: ["B...", "Grupp B"],
    Kod3: ["C...", "Grupp C"],
    Kod4: ["D...", "Grupp D"],
    Kod5: ["E...", "Grupp E"],
    Kod6: ["F...", "Grupp F"]
}

export type NollegruppKeyofRoles = keyof typeof NollegruppRoles;