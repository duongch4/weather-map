import React, { Component } from "react";
import { render } from "react-dom";
import { GoogleMap } from "../map/GoogleMap";
import { WeatherCard } from "../weather/WeatherCard";
import { LOCATIONS } from "../../config/location";
import { WeatherFeed, WeatherFormat } from "../weather/WeatherFeed";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { getJsonFromXml } from "../../utils/XmlToJson";
import { AlertMessage } from "../utils/AlertMessage";

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
};

export class Home extends Component<HomeProps, HomeState> {

    public readonly state: Readonly<HomeState> = {
        weather: {},
        errMessage: "",
        progress: 0
    };

    private formatData = (cityCode: string, weatherFeed: WeatherFeed): WeatherFormat => {
        const result: WeatherFormat = {
            watches: undefined,
            current: undefined,
            forecasts: []
        };
        for (const entry of weatherFeed.entry) {
            if (entry.id.includes(`${cityCode}_cc`)) {
                result.current = entry;
            }
            else if (entry.id.includes(`${cityCode}_w`)) {
                result.watches = entry;
            }
            else {
                result.forecasts.push(entry);
            }
        }
        return result;
    }

    private getWeatherInfo = async (cityCode: string) => {
        try {
            const url = `https://weather.gc.ca/rss/city/${cityCode}_e.xml`;
            const responseXmlText = await AjaxHandler.getRequest(url, "application/xml");
            const responseXmlDoc = new DOMParser().parseFromString(responseXmlText, "application/xml");
            const responseJson = getJsonFromXml(responseXmlDoc) as WeatherFeed;
            this.state.weather[cityCode] = this.formatData(cityCode, responseJson);

            const loadedCount = Object.keys(this.state.weather).length;
            const total = Object.keys(LOCATIONS).length;
            const progress = Math.floor(loadedCount / total * 100);
            this.setProgressBar(progress);

            this.setState({
                weather: this.state.weather,
                progress: progress
            });
        }
        catch (err) {
            this.setState({
                errMessage: `Code: ${err.code}; Status: ${err.status}`
            });
        }
    }

    private setProgressBar(progress: number) {
        this.props.showProgressBar(progress);
        if (progress >= 100) {
            setTimeout(this.props.hideProgressBar, 500); // TODO: What else can I do here?
        }
    }

    public componentDidMount() {
        for (const city in LOCATIONS) {
            this.getWeatherInfo(LOCATIONS[city].code);
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

    public render() {
        if (this.state.progress < 100) {
            return <div>{undefined}</div>;
        }
        else {
            return (
                <div id="home" className="container-fluid">
                    <AlertMessage message={this.state.errMessage} />
                    <div className="row">
                        <GoogleMap
                            id="google-map"
                            options={{
                                center: { lat: 54.726669, lng: -127.647621 },
                                zoom: 5
                            }}
                            onMapLoad={(map) => {
                                const markerIcon = {
                                    url: "http://image.flaticon.com/icons/svg/252/252025.svg",
                                    scaledSize: new google.maps.Size(30, 30),
                                    origin: new google.maps.Point(0, 0),
                                    anchor: new google.maps.Point(14, 30),
                                    labelOrigin: new google.maps.Point(13, -10)
                                };
                                for (const city in LOCATIONS) {
                                    const labelText = this.state.weather[LOCATIONS[city].code].current?.title.split(":")[1] as string;
                                    const marker = new window.google.maps.Marker({
                                        position: { lat: LOCATIONS[city].lat, lng: LOCATIONS[city].lng },
                                        map: map,
                                        title: city,
                                        animation: google.maps.Animation.DROP,
                                        icon: markerIcon,
                                        label: {
                                            text: labelText,
                                            color: "red",
                                            fontSize: "16px",
                                            fontWeight: "bold"
                                        }
                                    });
                                    marker.addListener("click", (e) => {
                                        this.createInfoWindow(e, map, city, LOCATIONS[city].code);
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            );
        }
    }
}
