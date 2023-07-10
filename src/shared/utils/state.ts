const STATE_IMPORT_PATH = "../../../" + (process.env.STATE_PATH ?? "src/shared/assets/state.json")
const STATE_WRITE_PATH = "./" + (process.env.STATE_PATH ?? "src/shared/assets/state.json")

import { writeFile } from "fs/promises";
const stateData = require(STATE_IMPORT_PATH) // eslint-disable-line @typescript-eslint/no-var-requires

// Get state/mode Harmony is in (default or mottagnings-mode)
export function getState(): string {
    return stateData.state;
}

export async function setState(mode: string): Promise<void> {
    console.log(`Setting mode to ${mode}.`);
    stateData.state = mode;
    const newStateData = JSON.stringify(stateData);
    try {
        await writeFile(STATE_WRITE_PATH, newStateData);
        console.log(`Mode successfully set to ${mode}.`);
    } catch (err) {
        console.warn(err);
        console.warn(`Failed to set mode to ${mode}.`);
    }
}

export function isMottagningsModeActive(): boolean {
    return getState() === "mottagning";
}