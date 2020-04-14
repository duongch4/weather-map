/**
 * For "debug" to work, we need to set a field in the browser’s Local Storage
 *   with "Key: debug" and "Value: can be anything followed by a colon and an asterisk (:*)"
 *   eg.:       Key: "debug"      Value: "client:*"
 */

import { debug } from "debug";

const BASE = "client";

type Colours = {
    [id: string]: string;
};
const COLOURS: Colours = {
    trace: "lightblue",
    info: "aqua",
    warn: "pink",
    error: "red"
}; // choose better colours :)

class Log {
    private generateMessage(level: string, message: any, source?: string) {
        // Set the prefix which will cause debug to enable the message
        const namespace = `${BASE}:${level}`;
        const createDebug = debug(namespace);

        // Set the colour of the message based on the level
        createDebug.color = COLOURS[level];

        if (source) {
            createDebug(source, message);
        }
        else {
            createDebug(message);
        }
    }

    public trace(message: any, source?: string) {
        return this.generateMessage("trace", message, source);
    }

    public info(message: any, source?: string) {
        return this.generateMessage("info", message, source);
    }

    public warn(message: any, source?: string) {
        return this.generateMessage("warn", message, source);
    }

    public error(message: any, source?: string) {
        return this.generateMessage("error", message, source);
    }
}

export default new Log();
