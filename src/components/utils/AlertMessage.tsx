import React from "react";

type AlertMessageProps = {
    message: string;
};

export const AlertMessage = (props: AlertMessageProps): React.ReactElement => {
    if (props.message) {
        return <div className="alert alert-warning">{props.message}</div>;
    }
    else {
        return <div>{undefined}</div>;
    }
};
