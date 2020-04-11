import React, { Component } from "react";
import { GoogleMap } from "./GoogleMap";

export class Home extends Component<any, any> {
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
                            const _ = new window.google.maps.Marker({
                            // const marker = new window.google.maps.Marker({
                                position: { lat: 53.726669, lng: -127.647621 },
                                map: map,
                                title: "Hello BC!"
                            });
                            // marker.addListener("click", e => {
                            //     this.createInfoWindow(e, map)
                            // })
                        }}
                    />

                </div>
            </div>
        );
    }
}
