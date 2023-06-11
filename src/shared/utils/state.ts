import { readFile, writeFile } from "fs";

// Get state/mode Harmony is in (default or mottagnings-mode)
export function getState(): string {
    let mode = "default";
    readFile("../../shared/assets/mode.txt", (err, data) => {
        if (err) // File does not exist -> default mode
            return;
        mode = data.toString();
    });
    return mode;
}

export function setState(mode: string) {
    writeFile("../../shared/assets/mode.txt", mode, (err) => {
        if (err)
            console.warn(err);
    });
}