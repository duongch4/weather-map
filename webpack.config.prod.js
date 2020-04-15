const webpack = require("webpack"); // access built-in plugins
const glob = require("glob"); // sync all css files, no need to import css
const TerserPlugin = require("terser-webpack-plugin"); // minify js: ES6
const HtmlWebpackPlugin = require("html-webpack-plugin"); // to build from html template
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // to extract css into it own file
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // to use with transpileOnly in ts-loader
const nodeExternals = require("webpack-node-externals"); // for backend
const path = require("path");
const envkeys = require("./envkeys.config");

class WebpackConfig {
    setModeResolve() {
        return {
            mode: "production",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"],
                modules: [path.resolve(__dirname, "node_modules")]
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
                configFile: path.resolve(__dirname, "babel.config.js"),
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

    setStyleLoader() {
        return {
            test: /\.s?css$/,
            use: [
                MiniCssExtractPlugin.loader,
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
                        name: "[hash]/[name].[ext]",
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
            // sourceMap: true
        });
    }

    setCommonPlugins(tsconfigPath) {
        const plugins = [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HashedModuleIdsPlugin(), // so that file hashes dont change unexpectedly
            new MomentLocalesPlugin({
                localesToKeep: ["en", "en-ca"],
            }),
            new ForkTsCheckerWebpackPlugin({
                eslint: true,
                tsconfig: tsconfigPath,
                async: false, // check type/lint first then build
                // workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE // recommended - leave two CPUs free (one for build, one for system)
            }),
            new webpack.EnvironmentPlugin(envkeys.ENV_KEYS) // For CI production process!!!
        ];
        if (require("fs").existsSync(path.resolve(__dirname, "./.env"))) {
            const fromDotEnv = new webpack.DefinePlugin({
                "process.env": JSON.stringify(require("dotenv").config({ path: path.resolve(__dirname, "./.env") }).parsed)
            })
            return [...plugins, fromDotEnv];
        }
        return plugins;
    }

    setClientConfig(
        fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html",
        toDir = "./dist/client", instanceName = "client",
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
            entry: {
                main: [coreJsPath, regenetorRuntimePath, entryTsPath].concat(glob.sync(allStyles)),
                pageIntro: path.resolve(__dirname, fromDir, "./pages/intro/IntroPage.tsx")
            },
            output: {
                filename: "[name].[contenthash:8].js",
                path: outPath,
                publicPath: "/" // (this + app.get("/*", ...)) fix client-side routing in prod mode
            },
            module: {
                rules: [
                    this.setJavascriptSourceMapLoader(),
                    this.setTranspilationLoader(),
                    this.setStyleLoader(),
                    this.setFileLoaderClient(),
                    this.setImageLoader()
                ]
            },
            optimization: {
                minimizer: [
                    this.setOptMinimizerUglifyJs(),
                    new OptimizeCSSAssetsPlugin({})
                ],
                runtimeChunk: "single",
                splitChunks: {
                    chunks: "all",
                    maxInitialRequests: Infinity,
                    minSize: 0,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                                // npm package names are URL-safe, but some servers don"t like @ symbols
                                return `npm.${packageName.replace("@", "")}`;
                            }
                        }
                    }
                }
            },
            plugins: [
                ...this.setCommonPlugins(tsconfigPath),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: entryHtmlPath,
                    title: htmlTitle,
                    favicon: faviconPath,
                    hash: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    }
                }),
                new MiniCssExtractPlugin({
                    filename: "[name].[hash].css",
                    chunkfilename: "[id].[hash].css"
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
        tsconfigPath = "./tsconfig.server.json"
    ) {
        const entryTsPath = path.resolve(__dirname, fromDir, entryTs);
        const outPath = path.resolve(__dirname, toDir);

        return {
            name: instanceName,
            target: "node",
            ...this.setModeResolve(),
            entry: [entryTsPath],
            output: {
                filename: toServerFile,
                path: outPath
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
            plugins: this.setCommonPlugins(tsconfigPath),
            externals: [nodeExternals()],
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

module.exports = () => {
    const webpackConfig = new WebpackConfig();

    const client = webpackConfig.setClientConfig(
        fromDir = "./client", entryTs = "index.tsx", entryHtml = "index.html",
        toDir = "./dist/client", instanceName = "client",
        htmlTitle = "Weather Map", faviconPath = "./client/assets/png/titleImg.png",
        tsconfigPath = path.resolve(__dirname, "./tsconfig.client.json")
    );
    const server = webpackConfig.setServerConfig(
        fromDir = "./server", entryTs = "server.ts", toDir = "./dist",
        toServerFile = "server.js", instanceName = "server",
        tsconfigPath = path.resolve(__dirname, "./tsconfig.server.json")
    );

    return [client, server];
};
