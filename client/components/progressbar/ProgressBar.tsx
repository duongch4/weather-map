import React from "react";

type ProgressBarProps = {
    progress: number;
    hide: boolean;
    indeterminate?: boolean;
};

export const ProgressBar = (props: ProgressBarProps) => {
    const progressStyle = {
        height: "5px",
        visibility: (props.hide) ? "hidden" : "visible" as "visible" | "hidden"
    };

    const progressBarWidth = (barWidth: number) => {
        return {
            width: `${barWidth}%`
        };
    };

    return (
        <div className="progress fixed-top" style={progressStyle}>
            <div
                className="progress-bar bg-info progress-bar-striped progress-bar-animated"
                style={(props.indeterminate) ? progressBarWidth(100) : progressBarWidth(props.progress)}
                area-valuenow={(props.indeterminate) ? 100 : props.progress}
                area-valuemin={0}
                area-valuemax={100}
            >{(props.indeterminate) ? undefined : props.progress}</div>
        </div>
    );
};
