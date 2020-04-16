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
const fs = require("fs");
const dotenv = require("dotenv");
const webpackConstants = require("./webpack.config.const");

class WebpackConfig {

    constructor() {
        this.common = { envFilePath: webpackConstants.envFilePathDev, ...webpackConstants.common };
        this.client = webpackConstants.client;
        this.server = webpackConstants.server;
    }

    setModeResolve() {
        return {
            mode: "development",
            devtool: "source-map",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"],
                modules: [this.common.nodeModulesPath]
            },
        };
    }

    setTranspilationLoader() {
        return {
            test: /\.(ts|js)x?$/,
            exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
            loader: "babel-loader",
            options: {
                rootMode: "upward",
                configFile: this.common.babelConfigPath,
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
                            path: this.client.postcssConfigPath
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
        let base = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            new webpack.HotModuleReplacementPlugin()
        ];
        if (fs.existsSync(this.common.envFilePath)) {
            const fromDotEnv = new webpack.DefinePlugin({
                "process.env": JSON.stringify(dotenv.config({ path: this.common.envFilePath }).parsed)
            });
            base = [...base, fromDotEnv];
        }
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

    setDevServer() {
        return {
            open: true,
            port: 8000,
            hot: true,
            contentBase: this.client.distPath,
            // watchContentBase: true, // watch the static shell html
            compress: true,
            historyApiFallback: true,
            clientLogLevel: "info", // debug, trace, silent, warn, error
            stats: "minimal", // errors-only, errors-warnings
            proxy: [
                {
                    context: ["/api/**"],
                    target: "http://localhost:3000"
                }
            ]
        };
    }

    setClientConfig(forBuild = false) {
        return {
            name: this.client.instanceName,
            target: "web",
            ...this.setModeResolve(),
            entry: [
                this.client.coreJsPath, this.client.regenetorRuntimePath,
                this.client.entryTsPath
            ].concat(glob.sync(this.client.allStylingPaths)),
            output: {
                filename: "[name].js",
                path: this.client.distPath,
                publicPath: "/" // (this + historyApiFallBack) fix client-side routing in dev mode
            },
            devServer: this.setDevServer(),
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
                ...this.setCommonPlugins(this.client.tsconfigPath),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: this.client.entryHtmlPath,
                    title: this.client.htmlTitle,
                    favicon: this.client.faviconPath
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

    setServerConfig(forBuildServerOnceToWatch = false) {
        return {
            name: this.server.instanceName,
            target: "node",
            ...this.setModeResolve(),
            entry: ["webpack/hot/poll?1000", this.server.entryTsPath],
            output: {
                filename: this.server.toServerFile,
                path: this.server.distPath,
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
            plugins: this.setCommonPlugins(this.server.tsconfigPath, forBuildServerOnceToWatch),
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
}

module.exports = (env, argv) => {
    const webpackConfig = new WebpackConfig();

    if (argv["stack"] === "client") {
        const client = webpackConfig.setClientConfig(forBuild = false);
        return client;
    }
    else if (argv["stack"] === "server-build-once") {
        const server = webpackConfig.setServerConfig(forBuildServerOnceToWatch = true);
        return server;
    }
    else if (argv["stack"] === "server") {
        const server = webpackConfig.setServerConfig(forBuildServerOnceToWatch = false);
        return server;
    }
    else { // build both
        const client = webpackConfig.setClientConfig(forBuild = true);
        const server = webpackConfig.setServerConfig(forBuildServerOnceToWatch = false);
        return [client, server];
    }
};
