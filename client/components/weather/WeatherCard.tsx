import React from "react";
import { WeatherFormat } from "./WeatherFeed";

type WeatherCardProps = {
    onUpdate: (city: string, cityCode: string) => Promise<void>;
    city: string;
    cityCode: string;
    weather: WeatherFormat;
};

export const WeatherCard = (props: WeatherCardProps) => (
    <div className="card">
        <div className="card-body">
            <h5 className="card-title text-center">{`${props.city}, BC`}</h5>
            <h6 className="card-subtitle mb-2 text-muted text-center">{props.weather.current?.title.split(":")[1]}</h6>
            <hr />
            <p className="card-text" dangerouslySetInnerHTML={{ __html: props.weather.current?.summary.text as string }} />
            <hr />
            <p className="card-text">
                <b>Watches/Warnings</b>: {props.weather.watches?.summary.text}
            </p>
            <hr />
            <div className="outer-block">
                <div className="inline-block">
                    <button
                        type="button" className="btn"
                        onClick={() => props.onUpdate(props.city, props.cityCode)}
                    >Update</button>
                </div>
                <div className="inline-block float-right">
                    <a className="btn" href={props.weather.current?.link.href} target="_blank" rel="noopener noreferrer">
                        Forecast
                    </a>
                </div>
            </div>
        </div>
    </div>
);
