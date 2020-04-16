const path = require("path");

module.exports = Object.freeze({
    envFilePathDev: path.resolve(__dirname, "./.env.dev"),
    
    envFilePathProd: path.resolve(__dirname, "./.env"),

    common: {
        babelConfigPath: path.resolve(__dirname, "babel.config.js"),
        nodeModulesPath: path.resolve(__dirname, "node_modules")
    },

    client: {
        instanceName: "client",

        htmlTitle: "Weather Map",
        faviconPath: path.resolve(__dirname, "./client/assets/png/titleImg.png"),
    
        entryTsPath: path.resolve(__dirname, "./client/index.tsx"),
        entryHtmlPath: path.resolve(__dirname, "./client/index.html"),
        allStylingPaths: path.resolve(__dirname, "./client/**/*.scss"),
        distPath: path.resolve(__dirname, "./dist/client"),
    
        coreJsPath: path.resolve(__dirname, "./node_modules", "core-js/stable"), // polyfill
        regenetorRuntimePath: path.resolve(__dirname, "./node_modules", "regenerator-runtime/runtime"), // polyfill
    
        tsconfigPath: path.resolve(__dirname, "./tsconfig.client.json"),
        postcssConfigPath: path.resolve(__dirname, "postcss.config.js")
    },
    
    clientPages: {
        homePagePath: path.resolve(__dirname, "./client/pages/home/HomePage.tsx")
    },
    
    server: {
        instanceName: "server",

        entryTsPath: path.resolve(__dirname, "./server/server.ts"),
        distPath: path.resolve(__dirname, "./dist"),
    
        tsconfigPath: path.resolve(__dirname, "./tsconfig.server.json"),
    
        toServerFile: "server.js"
    }
});
