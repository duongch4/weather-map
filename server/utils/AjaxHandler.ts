import axios, { AxiosRequestConfig, AxiosResponse } from "axios"; // Cannot use browser "fetch" in the server
import { NotFoundException } from "../communication/Exception";

export type TGenericObject<TValue> = {
    [key: string]: TValue;
};

export class AjaxHandler {

    public static getRequest(url: string, contentType = "application/json"): Promise<any> {
        return new Promise((resolve, reject) => {
            const opts: AxiosRequestConfig = {
                method: "GET",
                headers: {
                    "Content-Type": contentType,
                    "Cache-Control": "no-cache, no-store",
                    "Pragma": "no-cache"
                }
            };
            axios.get(
                url, opts
            ).then(
                (response: AxiosResponse<any>) => resolve(response.data),
            ).catch((err: any) => {
                if (err.response) { // error response from the server
                    switch (err.response.status) {
                        case 404:
                            return reject(new NotFoundException("Cannot find resource"));
                        default:
                            return reject(new Error(JSON.stringify(err.response)));
                    }
                }
                else { // error from something else
                    return reject(new Error(JSON.stringify(err)));
                }
            });
        });
    }
}
