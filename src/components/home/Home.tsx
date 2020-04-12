import React, { Component } from "react";
import { render } from "react-dom";
import { GoogleMap } from "../map/GoogleMap";
import { InfoWindow } from "../map/InfoWindow";

export class Home extends Component<any, any> {
    private createInfoWindow = (e: google.maps.MouseEvent, map: google.maps.Map<HTMLElement>) => {
        const infoWindow: google.maps.InfoWindow = new window.google.maps.InfoWindow({
            content: `<div id="info-window" />`,
            position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
        });
        infoWindow.addListener("domready", (_) => {
          render(<InfoWindow />, document.getElementById("info-window"));
        });
        infoWindow.open(map);
      }

    public render() {
        return (
            <div id="home" className="container-fluid">
                <div className="row">
                    <GoogleMap
                        id="google-map"
                        options={{
                            center: { lat: 53.726669, lng: -127.647621 },
                            zoom: 6
                        }}
                        onMapLoad={(map) => {
                            const marker = new window.google.maps.Marker({
                                position: { lat: 53.726669, lng: -127.647621 },
                                map: map,
                                title: "Hello BC!"
                            });
                            marker.addListener("click", (e) => {
                                this.createInfoWindow(e, map);
                            });
                        }}
                    />

                </div>
            </div>
        );
    }
}
