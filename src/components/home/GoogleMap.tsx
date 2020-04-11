import React, { Component } from "react";
import { GOOGLE_MAP_API_KEY } from "../../config/config";

type GoogleMapProps = {
    id: string;
    options?: google.maps.MapOptions;
    onMapLoad: (map: google.maps.Map<HTMLElement>) => void;
};

export class GoogleMap extends Component<GoogleMapProps, any> {

    private onScriptLoad = () => {
        const map = new window.google.maps.Map(
            document.getElementById(this.props.id) as HTMLElement,
            this.props.options
        );
        this.props.onMapLoad(map);
    }

    public componentDidMount = () => {
        if (!window.google) {
            const s = document.createElement("script");
            s.type = "text/javascript";
            if (GOOGLE_MAP_API_KEY) {
                s.src = `https://maps.google.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}`;
            }
            else {
                alert("Google Map API Key is not provided");
            }
            const x = document.getElementsByTagName("script")[0];
            if (x.parentNode) {
                x.parentNode.insertBefore(s, x);
            }
            // Below is important.
            // We cannot access google.maps until it"s finished loading
            s.addEventListener("load", (_) => {
                this.onScriptLoad();
            });
        }
        else {
            this.onScriptLoad();
        }
    }

    public render = () => {
        return (
            <div id={this.props.id} />
            // <div style={{ width: 900, height: 500 }} id={this.props.id} />
        );
    }
}
