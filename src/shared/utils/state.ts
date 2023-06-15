import { writeFile, readFile } from "fs/promises";

// Get state/mode Harmony is in (default or mottagnings-mode)
export async function getState(): Promise<string> {
    let mode = "default";
    let data;
    try {
        data = await readFile("./src/shared/assets/mode.txt");
        mode = data.toString()
    } catch (err) { // File does not exist -> default mode
        console.warn(err)
    }
    return mode;
}

export async function setState(mode: string): Promise<void> {
    try {
        await writeFile("./src/shared/assets/mode.txt", mode);
    } catch (err) {
        console.warn(err)
    }
}

export async function isMottagningsModeActive(): Promise<boolean> {
    return await getState() === "mottagning"
}