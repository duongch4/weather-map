import React, { Component } from "react";
import {
    Route,
    Switch,
} from "react-router-dom";

import { IntroPage } from "./intro/IntroPage";

export class MainRoutes extends Component<any, any> {
    public render() {
        return (
            <Switch>
                <Route
                    path={`/`}
                    component={IntroPage}
                />
                {/* <Route
                    path={`/the-second-route`}
                    component={Contact}
                /> */}
            </Switch>
        );
    }
}
