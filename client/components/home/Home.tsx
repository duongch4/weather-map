import React, { Component } from "react";
import { render } from "react-dom";
import { GoogleMap } from "../map/GoogleMap";
import { WeatherCard } from "../weather/WeatherCard";
import { LOCATIONS } from "../../config/location";
import { WeatherFormat } from "../weather/WeatherFeed";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { AlertMessage } from "../utils/AlertMessage";
import { TResponse } from "../../communication/TResponse";
import * as mapMarkerIcon from "../../assets/svg/mapMarkerIcon.svg";
import MarkerClusterer from "@google/markerclustererplus";

type HomeProps = {
    hideProgressBar: () => void;
    showProgressBar: (progress: number) => void;
};

type HomeState = {
    weather: {
        [cityCode: string]: WeatherFormat;
    };
    errMessage: string;
    progress: number;
    markers: {
        [cityCode: string]: google.maps.Marker;
    };
};

export class Home extends Component<HomeProps, HomeState> {

    public readonly state: Readonly<HomeState> = {
        weather: {},
        errMessage: "",
        progress: 0,
        markers: {}
    };

    private getWeatherInfo = (city: string, cityCode: string): Promise<void> => {
        const url = `/api/weather/${cityCode}`;
        return AjaxHandler.getRequest(url).then((responseJson: TResponse) => {
            this.state.weather[cityCode] = responseJson.payload as WeatherFormat;

            const loadedCount = Object.keys(this.state.weather).length;
            const total = Object.keys(LOCATIONS).length;
            const progress = Math.floor(loadedCount / total * 100);
            this.setProgressBar(progress);

            this.setState({
                weather: this.state.weather,
                progress: progress,
            });

            this.updateInfoWindow(city, cityCode);
            this.updateOneMarker(cityCode);
        }).catch((err) => {
            const errResponse = err.response.data as TResponse;
            this.setState({
                errMessage: `Code: ${errResponse.code}` + "\n" + `Status: ${errResponse.status}` + "\n" + `Message: ${errResponse.message}`
            });
        });
    }

    private setProgressBar(progress: number) {
        this.props.showProgressBar(progress);
        if (progress >= 100) {
            setTimeout(this.props.hideProgressBar, 500); // TODO: What else can I do here?
        }
    }

    public componentDidMount() {
        for (const city in LOCATIONS) {
            this.getWeatherInfo(city, LOCATIONS[city].code);
        }
    }

    private createInfoWindow = (e: google.maps.MouseEvent, map: google.maps.Map<HTMLElement>, city: string, cityCode: string) => {
        const infoWindow: google.maps.InfoWindow = new window.google.maps.InfoWindow({
            content: `<div id="info-window" />`,
            position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
        });
        infoWindow.addListener("domready", (_) => {
            render(
                <WeatherCard
                    onUpdate={this.getWeatherInfo}
                    city={city}
                    cityCode={cityCode}
                    weather={this.state.weather[cityCode]}
                />,
                document.getElementById("info-window")
            );
        });
        infoWindow.open(map);
    }

    private updateInfoWindow = (city: string, cityCode: string) => {
        if (document.getElementById("info-window")) {
            render(
                <WeatherCard
                    onUpdate={this.getWeatherInfo}
                    city={city}
                    cityCode={cityCode}
                    weather={this.state.weather[cityCode]}
                />,
                document.getElementById("info-window")
            );
        }
    }

    private updateOneMarker = (cityCode: string) => {
        this.state.markers[cityCode]?.setLabel({
            text: this.state.weather[cityCode].current?.title.split(":")[1] as string,
            color: "red",
            fontSize: "16px",
            fontWeight: "bold"
        });
    }


    private getMarkerIcon = () => (
        {
            url: mapMarkerIcon,
            scaledSize: new google.maps.Size(30, 30),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(14, 30),
            labelOrigin: new google.maps.Point(13, -10)
        }
    )

    private onMapLoad = (map: google.maps.Map<HTMLElement>) => {
        for (const city in LOCATIONS) {
            const labelText = this.state.weather[LOCATIONS[city].code].current?.title.split(":")[1] as string;
            const marker = new window.google.maps.Marker({
                position: { lat: LOCATIONS[city].lat, lng: LOCATIONS[city].lng },
                map: map,
                title: city, // Acting as an ID for this marker
                animation: google.maps.Animation.DROP,
                icon: this.getMarkerIcon(),
                label: {
                    // text: "labelText",
                    text: labelText,
                    color: "red",
                    fontSize: "16px",
                    fontWeight: "bold"
                }
            });

            this.state.markers[LOCATIONS[city].code] = marker;

            marker.addListener("click", (e) => {
                this.createInfoWindow(e, map, city, LOCATIONS[city].code);
            });
        }
        const _ = new MarkerClusterer(
            map, Object.values(this.state.markers),
            { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" }
        );
    }

    private renderHomeSuccess = () => (
        <div id="home" className="container-fluid">
            <AlertMessage message={this.state.errMessage} />
            <div className="row">
                <GoogleMap
                    id="google-map"
                    options={{
                        center: { lat: 54.726669, lng: -127.647621 },
                        zoom: 5
                    }}
                    onMapLoad={this.onMapLoad}
                />
            </div>
        </div>
    )

    private renderHomeOnLoad = () => (
        <div id="home" className="container-fluid">
            <AlertMessage message={this.state.errMessage} />
        </div>
    )

    public render() {
        if (this.state.progress < 100) {
            return this.renderHomeOnLoad();
        }
        else {
            return this.renderHomeSuccess();
        }
    }
}
