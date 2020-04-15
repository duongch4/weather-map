import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type TGenericObject<TValue> = {
    [key: string]: TValue;
};

export class AjaxHandler {

    public static getRequest(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const opts: AxiosRequestConfig = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store",
                    "Pragma": "no-cache" // Prevent IE11 from using cache constantly
                }
            };
            axios.get(
                url, opts
            ).then(
                (response: AxiosResponse<any>) => resolve(response.data)
            ).catch(
                (err: any) => reject(err)
            );
        });
    }
}
