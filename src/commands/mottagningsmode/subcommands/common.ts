import { Env } from "../../..";
import { isMottagningsModeActive, setState } from "../../../shared/utils/state";
import { registerCommands } from "../../register-commands";

export async function toggleMottagningsmode(): Promise<void> {
    const mottagningOn = await isMottagningsModeActive(); // Read current mode
    const newMode = mottagningOn ? "default" : "mottagning";
    const env = process.env.NODE_ENV as Env;

    await setState(newMode);
    await registerCommands(env);
}