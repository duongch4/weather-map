import React, { Component } from "react";

export class Header extends Component<any, any> {
    public render() {
        return (
            <div id="navigation">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            Weather Map<span className="sr-only">(current)</span>
                        </a>
                    </div>
                </nav>
            </div>
        );
    }
}
