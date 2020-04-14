const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const TerserPlugin = require("terser-webpack-plugin"); // minify js: ES6
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // to use with transpileOnly in ts-loader
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const nodeExternals = require("webpack-node-externals"); // for backend
const path = require("path");
const dotenv = require("dotenv").config({ path: path.resolve(__dirname, "./.env.dev") });
const fs = require("fs");

class WebpackConfig {
    setModeResolve() {
        return {
            mode: "development",
            devtool: "source-map",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"],
                modules: [path.resolve(__dirname, "node_modules")]
            },
        };
    }

    setTranspilationLoader() {
        return {
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                rootMode: "upward",
                cacheDirectory: true
            }
        };
    }

    setJavascriptSourceMapLoader() {
        return {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        };
    }

    setStyleLoader(forBuild = false) {
        const result = {
            test: /\.s?css$/,
            use: [
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                        config: {
                            path: path.resolve(__dirname, "postcss.config.js")
                        }
                    },
                },
            ]
        };
        if (forBuild) {
            result.use = [MiniCssExtractPlugin.loader, ...result.use];
        }
        else { // watch-mode: want HMR for style: need style-loader
            result.use = ["style-loader", ...result.use];
        }
        return result;
    }

    setImageLoader() {
        return {
            test: /\.(jpe?g|png|gif|svg)$/,
            loader: "image-webpack-loader",
            enforce: "pre"
        };
    }

    setFileLoaderClient() {
        return {
            test: /\.(jpe?g|png|gif|svg|pdf)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets"
                    }
                }
            ]
        };
    }

    setFileLoaderServer() {
        return {
            test: /\.(jpe?g|png|gif|svg|pdf)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        emitFile: false
                    }
                }
            ]
        };
    }

    setOptMinimizerUglifyJs() {
        return new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        });
    }

    setCommonPlugins(tsconfigPath, forBuildServerOnceToWatch = false) {
        const base = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                "process.env": JSON.stringify(dotenv.parsed)
            })
        ];
        if (forBuildServerOnceToWatch) {
            return base;
        }
        else {
            return [
                ...base,
                new ForkTsCheckerWebpackPlugin({
                    eslint: true,
                    tsconfig: tsconfigPath
                }),
                new ForkTsCheckerNotifierWebpackPlugin({
                    title: "TypeScript",
                    excludeWarnings: false
                }),
            ];
        }
    }

    setDevServer(outPath) {
        return {
            open: true,
            port: 8000,
            hot: true,
            contentBase: outPath,
            // watchContentBase: true, // watch the static shell html
            compress: true,
            historyApiFallback: true,
            clientLogLevel: "info", // debug, trace, silent, warn, error
            stats: "minimal", // errors-only, errors-warnings
            proxy: [ // Will not work if server-controller methods are using Promises!!! Have to use actual Domain!
                {
                    context: ["/api/*"],
                    target: "http://localhost:3000"
                }
            ]
        };
    }

    setClientConfig(
        fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html",
        toDir = "./dist/client", instanceName = "client", forBuild = false,
        htmlTitle = "MERN", faviconPath = "./client/assets/png/titleImg.png",
        tsconfigPath = "./tsconfig.client.json"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const entryHtmlPath = path.resolve(__dirname, fromDir, entryHtml);
        const allStyles = path.resolve(__dirname, fromDir, "**", "*.scss");
        const outPath = path.resolve(__dirname, toDir);

        const coreJsPath = path.resolve(__dirname, "./node_modules", "core-js/stable"); // polyfill
        const regenetorRuntimePath = path.resolve(__dirname, "./node_modules", "regenerator-runtime/runtime"); // polyfill

        return {
            name: instanceName,
            target: "web",
            ...this.setModeResolve(),
            entry: [coreJsPath, regenetorRuntimePath, entryTsPath].concat(glob.sync(allStyles)),
            output: {
                filename: "[name].js",
                path: outPath,
                publicPath: "/" // (this + historyApiFallBack) fix client-side routing in dev mode
            },
            devServer: this.setDevServer(outPath),
            module: {
                rules: [
                    this.setJavascriptSourceMapLoader(),
                    this.setTranspilationLoader(),
                    this.setStyleLoader(forBuild),
                    this.setFileLoaderClient(),
                    this.setImageLoader()
                ]
            },
            optimization: {
                minimizer: [
                    this.setOptMinimizerUglifyJs(),
                    new OptimizeCSSAssetsPlugin({})
                ]
            },
            plugins: [
                ...this.setCommonPlugins(tsconfigPath),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: entryHtmlPath,
                    title: htmlTitle,
                    favicon: faviconPath
                }),
                new MiniCssExtractPlugin({
                    filename: "[name].css",
                    chunkfilename: "[id].css"
                }),
                new ImageminPlugin({}),
            ],
            externals: {
                "react": "React",
                "react-dom": "ReactDOM",
                "react-dom/server": "ReactDOMServer",
                "lodash": "_"
            },
        };
    }

    setServerConfig(
        fromDir = "./server", entryTs = "server.ts", toDir = "./dist",
        toServerFile = "server.js", instanceName = "server",
        tsconfigPath = "./tsconfig.server.json", forBuildServerOnceToWatch = false
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const outPath = path.resolve(__dirname, toDir);

        if (dotenv.parsed["OVERNIGHT_LOGGER_MODE"] && dotenv.parsed["OVERNIGHT_LOGGER_MODE"] === "FILE") {
            this.setServerLogPath();
        }

        return {
            name: instanceName,
            target: "node",
            ...this.setModeResolve(),
            entry: ["webpack/hot/poll?1000", entryTsPath],
            output: {
                filename: toServerFile,
                path: outPath,
            },
            module: {
                rules: [
                    this.setJavascriptSourceMapLoader(),
                    this.setTranspilationLoader(),
                    this.setFileLoaderServer()
                ]
            },
            optimization: {
                minimizer: [this.setOptMinimizerUglifyJs()]
            },
            plugins: this.setCommonPlugins(tsconfigPath, forBuildServerOnceToWatch),
            externals: [
                nodeExternals({
                    whitelist: ["webpack/hot/poll?1000"]
                })
            ],
            node: {
                // console: false,
                // globale: false,
                // process: false,
                // Buffer: false,
                __filename: false,
                __dirname: false
            }
        };
    }

    setServerLogPath() {
        const logFileDir = path.join(__dirname, "log");
        const today = new Date().toDateString().split(" ").join("_");
        const logFilePath = path.join(logFileDir, `backend_${today}.log`);
        if (!fs.existsSync(logFileDir)) {
            fs.mkdirSync(logFileDir);
        }
        dotenv.parsed["OVERNIGHT_LOGGER_FILEPATH"] = logFilePath;
    }
}

module.exports = (env, argv) => {
    const webpackConfig = new WebpackConfig();

    if (argv["stack"] === "client") {
        const client = webpackConfig.setClientConfig(
            fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html",
            toDir = "./dist/client", instanceName = "client", forBuild = false,
            htmlTitle = "MERN", faviconPath = "./client/assets/png/titleImg.png",
            tsconfigPath = path.resolve(__dirname, "./tsconfig.client.json")
        );
        return client;
    }
    else if (argv["stack"] === "server-build-once") {
        const server = webpackConfig.setServerConfig(
            fromDir = "./server", entryTs = "server.ts", toDir = "./dist",
            toServerFile = "server.js", instanceName = "server",
            tsconfigPath = path.resolve(__dirname, "./tsconfig.server.json"),
            forBuildServerOnceToWatch = true
        );
        return server;
    }
    else if (argv["stack"] === "server") {
        const server = webpackConfig.setServerConfig(
            fromDir = "./server", entryTs = "server.ts", toDir = "./dist",
            toServerFile = "server.js", instanceName = "server",
            tsconfigPath = path.resolve(__dirname, "./tsconfig.server.json"),
            forBuildServerOnceToWatch = false
        );
        return server;
    }
    else { // build both
        const client = webpackConfig.setClientConfig(
            fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html",
            toDir = "./dist/client", instanceName = "client", forBuild = true,
            htmlTitle = "Weather Map", faviconPath = "./client/assets/png/titleImg.png",
            tsconfigPath = path.resolve(__dirname, "./tsconfig.client.json")
        );
        const server = webpackConfig.setServerConfig(
            fromDir = "./server", entryTs = "server.ts", toDir = "./dist",
            toServerFile = "server.js", instanceName = "server",
            tsconfigPath = path.resolve(__dirname, "./tsconfig.server.json"),
            forBuildServerOnceToWatch = false
        );
        return [client, server];
    }
};
