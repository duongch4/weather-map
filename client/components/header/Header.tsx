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

                        <button className="navbar-toggler" type="button"
                            data-toggle="collapse" data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                        >
                            <span className="fas fa-bars burger-icon" />
                        </button>
                    </div>
                </nav>
            </div>
        );
    }
}
