import React from "react";

type JsonPrintProps = {
    data: {};
};

function isEmptyObj(obj: {}): boolean {
    return Object.keys(obj).length === 0 || typeof obj === "undefined";
}

export const JsonPrint = (props: JsonPrintProps): React.ReactElement => {
    if (!isEmptyObj(props.data)) {
        return <div className="text-left"><pre>{JSON.stringify(props.data, undefined, 2)}</pre></div>;
    }
    else {
        return <div>{undefined}</div>;
    }
};
