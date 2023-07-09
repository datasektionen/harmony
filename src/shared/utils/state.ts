import { writeFile, readFile } from "fs/promises";

// Get state/mode Harmony is in (default or mottagnings-mode)
export async function getState(): Promise<string> {
    let mode = "default";
    try {
        const data = await readFile("./src/shared/assets/mode.txt");
        mode = data.toString();
    } catch (err) { // File does not exist -> default mode
        console.warn(err);
        console.log("Mottagnings-mode file may be missing. It will now be created if it doesn't exist.");
        setState(mode);
    }
    return mode;
}

export async function setState(mode: string): Promise<void> {
    console.log(`Setting mode to ${mode}.`);
    try {
        await writeFile("./src/shared/assets/mode.txt", mode);
        console.log(`Mode successfully set to ${mode}.`);
    } catch (err) {
        console.warn(err);
        console.warn(`Failed to set mode to ${mode}.`);
    }
}

export async function isMottagningsModeActive(): Promise<boolean> {
    return await getState() === "mottagning";
}