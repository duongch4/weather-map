module.exports = (api) => {
    api.cache(true);

    const sourceType = "module";
    // const sourceType = "unambiguous";

    const presets = [
        [
            "@babel/preset-env",
            {
                "debug": true,
                // "useBuiltIns": "usage",
                // // "useBuiltIns": "entry",
                // // "corejs": 3,
                // "corejs": { "version": "3.6", "proposals": true },
                // "modules": "commonjs"
            }
        ],
        "@babel/preset-react",
        "@babel/preset-typescript"
    ];

    const plugins = [
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
    ];

    return {
        sourceType,
        presets,
        plugins
    };
};
