import React, { Component } from "react";
import { render } from "react-dom";
import { GoogleMap } from "../map/GoogleMap";
import { InfoWindow } from "../map/InfoWindow";
import { Weather } from "../weather/WeatherCard";
import { LOCATIONS } from "../../config/location";

export class Home extends Component<any, any> {

    private createInfoWindow = (e: google.maps.MouseEvent, map: google.maps.Map<HTMLElement>, cityCode: string) => {
        const infoWindow: google.maps.InfoWindow = new window.google.maps.InfoWindow({
            content: `<div id="info-window" />`,
            position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
        });
        infoWindow.addListener("domready", (_) => {
          render(<Weather cityCode={cityCode} />, document.getElementById("info-window"));
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
                            center: { lat: 54.726669, lng: -127.647621 },
                            zoom: 5
                        }}
                        onMapLoad={(map) => {
                            for (const city in LOCATIONS) {
                                const marker = new window.google.maps.Marker({
                                    position: { lat: LOCATIONS[city].lat, lng: LOCATIONS[city].lng },
                                    map: map,
                                    title: city
                                });
                                marker.addListener("click", (e) => {
                                    this.createInfoWindow(e, map, LOCATIONS[city].code);
                                });
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}
