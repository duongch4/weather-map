import fetch, { RequestInit, Response } from "node-fetch"; // Cannot use browser "fetch" in the server
import { NotFoundException } from "../communication/Exception";

export type TGenericObject<TValue> = {
    [key: string]: TValue;
};

export class AjaxHandler {

    public static getRequest(url: string, contentType = "application/json"): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const opts: RequestInit = {
                    method: "GET",
                    headers: {
                        "Content-Type": contentType
                    }
                };
                const response: Response = await fetch(url, opts);

                if (response.ok) {
                    return resolve(response.text());
                }
                else if (response.status === 404) {
                    throw new NotFoundException("Cannot find resource");
                }
                else {
                    throw new Error(await response.text());
                }
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    public static putRequest(url: string, data: TGenericObject<any> = {}): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                // const dataFormated = {};
                // this.assign(dataFormated, ["attributes", data.key], data.val);
                // console.log(dataFormated);

                const response: Response = await fetch(url, {
                    method: "PUT", // *GET, POST, PUT, DELETE, etc.
                    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json"
                    },
                    // redirect: "follow", // manual, *follow, error
                    // referrer: "no-referrer", // no-referrer, *client
                    body: JSON.stringify(data), // body data type must match "Content-Type" header
                });
                // console.log(response);
                if (response.ok) {
                    return resolve(response.json());
                }
                else {
                    const err = await response.json();
                    throw new Error(err.message);
                }
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    public static postRequest(url: string, data: TGenericObject<any> = {}): Promise<any> {
        // console.log(JSON.stringify(data));
        return new Promise(async (resolve, reject) => {
            try {
                const response: Response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    return resolve(response.json());
                }
                else {
                    // Log.info("a", "postRequest() in AjaxHandler");
                    const err = await response.json();
                    // Log.trace(err);
                    if (err instanceof Array) {
                        throw new Error(err[0].msg); // Get only the first express-validator result
                    }
                    else {
                        throw new Error(err.message);
                    }
                }
            }
            catch (err) {
                // Log.info("b");
                // Log.error(err);
                return reject(err);
            }
        });
    }

    public static assign(obj: TGenericObject<any>, keyArray: string[], value: string) {
        const lastKeyIndex = keyArray.length - 1;
        for (let i = 0; i < lastKeyIndex; i++) {
            const key = keyArray[i];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }
        obj[keyArray[lastKeyIndex]] = value;
    }
}
