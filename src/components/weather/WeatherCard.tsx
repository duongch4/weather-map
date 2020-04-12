import React, { Component } from "react";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { getJsonFromXml } from "../../utils/XmlToJson";
import { JsonPrint } from "../utils/JsonPrint";
import { AlertMessage } from "../utils/AlertMessage";

type WeatherProps = {
    cityCode: string;
};

type WeatherState = {
    weather: {};
    errMessage: string;
};

export class Weather extends Component<WeatherProps, WeatherState> {
    public readonly state: Readonly<WeatherState> = {
        weather: {},
        errMessage: ""
    };

    public async componentDidMount() {
        try {
            const url = `https://weather.gc.ca/rss/city/${this.props.cityCode}_e.xml`;
            const responseXmlText = await AjaxHandler.getRequest(url, "application/xml");
            const responseXmlDoc = new DOMParser().parseFromString(responseXmlText, "application/xml");
            const responseJson = getJsonFromXml(responseXmlDoc);
            this.setState({
                weather: responseJson
            });
        }
        catch (err) {
            this.setState({
                errMessage: `Code: ${err.code}; Status: ${err.status}`
            });
        }
    }

    public render() {
        return (
            <div className="card">
                <AlertMessage message={this.state.errMessage} />
                <div className="card-body">
                    <h5 className="card-title">Weather Card</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                    <p className="card-text">
                        <JsonPrint data={this.state.weather} />
                    </p>
                    <a href="#" className="card-link">Card link</a>
                    <a href="#" className="card-link">Another link</a>
                </div>
            </div>
        );
    }
}
