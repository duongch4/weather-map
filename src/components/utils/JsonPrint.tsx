import React from "react";

type JsonPrintProps = {
    data: {};
};

const isEmptyObj = (obj: {}): boolean => {
    return typeof obj === "undefined" || Object.keys(obj).length === 0;
};

export const JsonPrint = (props: JsonPrintProps): React.ReactElement => {
    if (!isEmptyObj(props.data)) {
        return <div className="text-left"><pre>{JSON.stringify(props.data, undefined, 2)}</pre></div>;
    }
    else {
        return <div>{undefined}</div>;
    }
};
