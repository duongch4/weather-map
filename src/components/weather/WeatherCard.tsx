import React, { Component } from "react";
import { WeatherFormat } from "./WeatherFeed";

type WeatherCardProps = {
    onUpdate: (cityCode: string) => Promise<void>;
    city: string;
    cityCode: string;
    weather: WeatherFormat;
};

export class WeatherCard extends Component<WeatherCardProps, any> {

    private onClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        await this.props.onUpdate(this.props.cityCode);
    }

    public render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-center">{`${this.props.city}, BC`}</h5>
                    <h6 className="card-subtitle mb-2 text-muted text-center">{this.props.weather.current?.title.split(":")[1]}</h6>
                    <hr />
                    <p className="card-text" dangerouslySetInnerHTML={{ __html: this.props.weather.current?.summary.text as string }} />
                    <hr />
                    <p className="card-text">
                        <b>Watches/Warnings</b>: {this.props.weather.watches?.summary.text}
                    </p>
                    <hr />
                    <div className="outer-block">
                        <div className="inline-block">
                            <button type="button" className="btn" onClick={this.onClick}>Update</button>
                        </div>
                        <div className="inline-block float-right">
                            <a className="btn" href={this.props.weather.current?.link.href} target="_blank" rel="noopener noreferrer">
                                Forecasts
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
