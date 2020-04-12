type TCity = {
    lat: number;
    lng: number;
    code: string;
};

type TLocation = {
    [city: string]: TCity;
};

export const LOCATIONS: TLocation = {
    "Dease Lake": {
        "lat": 58.437408,
        "lng": -130.000229,
        "code": "bc-14"
    },
    "Fort Nelson": {
        "lat": 58.80533,
        "lng": -122.7002,
        "code": "bc-83"
    },
    "Terrace": {
        "lat": 54.51634,
        "lng": -128.60345,
        "code": "bc-80"
    },
    "Prince George": {
        "lat": 53.9166,
        "lng": -122.75301,
        "code": "bc-79"
    },
    "Whistler": {
        "lat": 50.1164,
        "lng": -122.96946,
        "code": "bc-86"
    },
    "Creston": {
        "lat": 49.09987,
        "lng": -116.50211,
        "code": "bc-26"
    },
    "Revelstoke": {
        "lat": 50.98317,
        "lng": -118.2023,
        "code": "bc-65"
    }
};

export const LANGUAGE = "e"; // English
