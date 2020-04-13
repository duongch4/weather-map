import React, { Component } from "react";

import { Footer } from "../../components/footer/Footer";
import { Home } from "../../components/home/Home";
import { Header } from "../../components/header/Header";
import { ProgressBar } from "../../components/utils/ProgressBar";

type IntroPageState = {
    progress: number;
    hide: boolean;
};

export class IntroPage extends Component<any, IntroPageState> {

    public readonly state: Readonly<IntroPageState> = {
        progress: 0,
        hide: true
    };

    private hideProgressBar = () => {
        this.setState({
            hide: true,
            progress: 0
        });
    }

    private showProgressBar = (progress: number) => {
        this.setState({
            hide: false,
            progress: progress
        });
    }

    public render() {
        return (
            <div className="App">

                <Header />
                <div className="progress-bar-div"><ProgressBar progress={this.state.progress} hide={this.state.hide} /></div>

                <Home hideProgressBar={this.hideProgressBar} showProgressBar={this.showProgressBar} />

                <Footer />

            </div>
        );
    }
}
