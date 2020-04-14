import { Request, Response } from "express";
import { Controller, Get } from "@overnightjs/core";
import { TResponse } from "../../communication/TResponse";
import { AjaxHandler } from "../../utils/AjaxHandler";
import { getJsonFromXml } from "../../utils/XmlToJson";
import { WeatherFeed, WeatherFormat } from "./WeatherFeed";
import { NotFoundException, InternalServerException } from "../../communication/Exception";
import { JSDOM } from "jsdom";

@Controller("api/weather")
export class WeatherController {

    @Get(":cityCode")
    public getWeather(req: Request, res: Response) {
        return new Promise (async (resolve, reject) => {
            const cityCode = req.params.cityCode;
            try {
                const url = `https://weather.gc.ca/rss/city/${cityCode}_e.xml`;
                const responseXmlText = await AjaxHandler.getRequest(url, "application/xml");
                const dom = new JSDOM(""); // Mimic Browser DOM
                const DOMParser = dom.window.DOMParser;
                const responseXmlDoc = new DOMParser().parseFromString(responseXmlText, "application/xml");
                const responseJson = getJsonFromXml(responseXmlDoc) as WeatherFeed;
                const response: TResponse = {
                    status: "OK",
                    code: 200,
                    payload: this.formatData(cityCode, responseJson),
                    message: "Successfully retrieved data"
                };
                return resolve(res.status(200).json(response));
            }
            catch (err) {
                let error;
                switch (true) {
                    case err instanceof NotFoundException:
                        error = new NotFoundException(`Cannot find weather information for city code: "${cityCode}"`);
                        return reject(res.status(404).json(error.response));
                    default:
                        error = new InternalServerException(err.message);
                        return reject(res.status(500).json(error.response));
                }
            }
        });
    }

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
}
