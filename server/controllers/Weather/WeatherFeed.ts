type WeatherAuthor = {
    name: string;
    uri: string;
};

export type WeatherEntry = {
    id: string;
    category: string;
    link: {
        type: string;
        href: string;
    };
    published: Date;
    summary: {
        attributes: any;
        text: string;
    };
    title: string;
    updated: Date;
};

export type WeatherFeed = {
    attributes: any;
    author: WeatherAuthor;
    entry: WeatherEntry[];
    icon: string;
    id: string;
    link: any;
    logo: string;
    rights: string;
    title: string;
    updated: Date;
};

export type WeatherFormat = {
    watches?: WeatherEntry;
    current?: WeatherEntry;
    forecasts: WeatherEntry[];
};
