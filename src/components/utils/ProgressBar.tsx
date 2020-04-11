import React, { Component } from "react";

type ProgressBarProps = {
    percentageProp: number;
};

type ProgressBarStates = {
    percentage: number;
    hide: boolean;
};

export class ProgressBar extends Component<ProgressBarProps, ProgressBarStates> {

    public readonly state: Readonly<ProgressBarStates> = {
        percentage: 0,
        hide: true,
    };

    public static getDerivedStateFromProps(nextProps: ProgressBarProps, prevState: ProgressBarStates) {

        const nextState = {
            percentage: nextProps.percentageProp,
            hide: prevState.hide
        };

        if (nextProps.percentageProp !== prevState.percentage) {
            if (nextProps.percentageProp === 100 && prevState.percentage === 0) {
                nextState.hide = false;
                setTimeout(() => {
                    nextState.hide = true;
                    return nextState;
                }, 1000);
            }
            else if (nextProps.percentageProp === 0 && prevState.percentage === 100) {
                nextState.hide = true;
            }
            return nextState;
        }
        else {
            return undefined; // Triggers no change in the state
        }
    }

    public render() {
        const progressStyle = {
            height: "2px",
            visibility: "visible" as "visible" | "hidden"
        };

        const progressBarStyle = {
            width: `${this.state.percentage}%`,
        };

        if (this.state.hide) {
            progressStyle.visibility = "hidden";
        }

        return (
            <div className="progress" style={progressStyle}>
                <div className="progress-bar progress-bar-striped" style={progressBarStyle} />
            </div>
        );
    }
}
