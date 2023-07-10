import { writeFile, readFile, unlink } from "fs/promises";

const STATE_PATH = process.env.STATE_PATH ?? 'src/shared/assets/state.json'

async function main() {
    const TEMP_MODE = process.argv.includes('--temp')

    if (!STATE_PATH) {
        console.log("Path to state.json cannot be found. Please add STATE_PATH variable to .env");
        return;
    }
    try {
        const data = await readFile(STATE_PATH);
        const state = JSON.parse(data.toString());
        if (TEMP_MODE && !state.hasOwnProperty('temp')) {
            console.log("Running in temp mode, will not delete non-temp file.");
            return;
        }
        console.log("state.json file exists and will be deleted.")
        try {
            await unlink(STATE_PATH)
        } catch (err) {
            console.warn(err);
            console.warn("Error uncountered while deleting state.json. File may not have been deleted.")
        }
    } catch (err) { // File does not exist -> default mode
        console.warn(err);
        console.log("state.json file may not exist. It cannot be deleted.");
    }
}
main()