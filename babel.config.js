module.exports = (api) => {
    api.cache(true);

    const sourceType = "module";
    // const sourceType = "unambiguous";

    const presets = [
        [
            "@babel/preset-env",
            {
                "targets": {"esmodules": true} // Enable async/await for Server Controllers
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
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining"
    ];

    return {
        sourceType,
        presets,
        plugins
    };
};
