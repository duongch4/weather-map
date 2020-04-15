// Avoid `console` errors in browsers that lack a console (when not explicitly opening console window like IE11).
export const disableConsoleWindowIfNotSupported = () => {
    let method;
    // eslint-disable-next-line no-empty-function
    const noop = () => { };
    const methods = [
        "assert", "clear", "count", "debug", "dir", "dirxml", "error",
        "exception", "group", "groupCollapsed", "groupEnd", "info", "log",
        "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd",
        "timeline", "timelineEnd", "timeStamp", "trace", "warn"
    ];
    let length = methods.length;
    const console: any = ((window as any).console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
};
