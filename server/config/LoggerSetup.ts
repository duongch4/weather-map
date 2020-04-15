import { Logger } from "@overnightjs/logger";
import { LoggerModeOptions } from "@overnightjs/logger/lib/constants";
import fs from "fs";
import path from "path";

export function setLogger() {
    Logger.mode = process.env["OVERNIGHT_LOGGER_MODE"] as LoggerModeOptions;
    if (Logger.mode === "FILE") {
        const logFileDir = path.join(__dirname, "log");
        const today = new Date().toDateString().split(" ").join("_");
        const logFilePath = path.join(logFileDir, `backend_${today}.log`);
        if (!fs.existsSync(logFileDir)) {
            fs.mkdirSync(logFileDir);
        }
        Logger.filePath = logFilePath;
        Logger.rmTimestamp = false;
    }
}
