import React from "react";

type ProgressBarProps = {
    progress: number;
    hide: boolean;
};

export const ProgressBar = (props: ProgressBarProps) => {
    const progressStyle = {
        height: "5px",
        visibility: (props.hide) ? "hidden" : "visible" as "visible" | "hidden"
    };

    const progressBarStyle = {
        width: `${props.progress}%`,
    };

    return (
        <div className="progress" style={progressStyle}>
            <div className="progress-bar progress-bar-striped" style={progressBarStyle} />
        </div>
    );
};
