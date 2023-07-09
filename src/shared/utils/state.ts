import { writeFile } from "fs/promises";
import stateData from "../../shared/assets/state.json"

// Get state/mode Harmony is in (default or mottagnings-mode)
export function getState(): string {
    return stateData.state;
}

export async function setState(mode: string): Promise<void> {
    console.log(`Setting mode to ${mode}.`);
    stateData.state = mode;
    const newStateData = JSON.stringify(stateData);
    try {
        await writeFile("./src/shared/assets/state.json", newStateData);
        console.log(`Mode successfully set to ${mode}.`);
    } catch (err) {
        console.warn(err);
        console.warn(`Failed to set mode to ${mode}.`);
    }
}

export async function isMottagningsModeActive(): Promise<boolean> {
    return getState() === "mottagning";
}