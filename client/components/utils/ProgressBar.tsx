import React from "react";

type ProgressBarProps = {
    progress: number;
    hide: boolean;
};

export const ProgressBar = (props: ProgressBarProps) => {
    const progressStyle = {
        height: "10px",
        visibility: (props.hide) ? "hidden" : "visible" as "visible" | "hidden"
    };

    const progressBarStyle = {
        width: `${props.progress}%`,
    };

    return (
        <div className="progress" style={progressStyle}>
            <div className="progress-bar bg-info progress-bar-striped" style={progressBarStyle}>{props.progress}</div>
        </div>
    );
};
