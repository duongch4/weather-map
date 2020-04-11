import React, { Component } from "react";

import { Footer } from "../../components/footer/Footer";
import { Home } from "../../components/home/Home";
import { Header } from "../../components/header/Header";

export class IntroPage extends Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="App">

                <Header />

                <Home />

                <Footer />

            </div>
        );
    }
}
