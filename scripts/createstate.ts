import { writeFile, readFile } from "fs/promises";

const STATE_PATH = process.env.STATE_PATH ?? 'src/shared/assets/state.json'
const DEFAULT_MODE = process.env.DEFAULT_STATE ?? 'mottagning'

async function main() {
    const TEMP_MODE = process.argv.includes('--temp')

    if (!STATE_PATH) {
        console.log("Path to state.json cannot be found. Please add STATE_PATH variable to .env");
        return;
    }

    try {
        await readFile(STATE_PATH);
        console.log("state.json file already exists and will not be overwritten.")
    } catch (err) { // File does not exist -> default mode
        if (!DEFAULT_MODE) {
            console.log("No default mode can be set and state.json cannot be created. Please add DEFAULT_STATE variable to .env");
            return;
        }
        let json = TEMP_MODE ? `{\n\t"state":"${DEFAULT_MODE}",\n\t"temp":true\n}` : `{"state":"${DEFAULT_MODE}"}`

        console.log("state.json file may be missing: It will now be created if it doesn't exist.");
        try {
            await writeFile(STATE_PATH, json);
            console.log(`state.json file created: Mode successfully set to ${DEFAULT_MODE}.`);
        } catch (err) {
            console.warn('Failed to create state.json file.');
        }
    }
}
main()
