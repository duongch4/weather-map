import { Logger } from "@overnightjs/logger";
import { LoggerModeOptions } from "@overnightjs/logger/lib/constants";

export function setLogger() {
    Logger.mode = process.env["OVERNIGHT_LOGGER_MODE"] as LoggerModeOptions;
    if ((Logger.mode === "FILE") && process.env["OVERNIGHT_LOGGER_FILEPATH"]) {
        Logger.filePath = process.env["OVERNIGHT_LOGGER_FILEPATH"] as string;
        Logger.rmTimestamp = false;
    }
}
