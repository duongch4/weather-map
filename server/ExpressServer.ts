import http from "http";
import express from "express";

import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";

import { setLogger } from "./config/LoggerSetup";
import path from "path";

import errorHandler from "errorhandler";

import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as controllers from "./controllers";

// API keys and Passport configuration
// import passportConfig from "./auth/passport";

// Create Express server
export class ExpressServer extends Server {

    constructor() {
        super(true);
        this.config();
    }

    public getApp(): express.Application {
        return this.app;
    }

    private config(): void {
        setLogger();
        this.app.use(compression());
        this.setBodyParser();
        this.setLusca();
        this.setCORS();
        this.setRoutes();
        this.setStaticFrontend();
        this.handleError();
    }

    public listen(port: string): http.Server {
        const server = this.app.listen(port, () => {
            Logger.Info(`App is running at PORT ${port} in "${this.app.get("env")}" mode`);
            if (process.env.NODE_ENV !== "production") {
                Logger.Info("Press CTRL-C to stop");
            }
        });
        return server;
    }

    private setBodyParser() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private setLusca(): void {
        this.app.use(lusca.xframe("SAMEORIGIN"));
        this.app.use(lusca.xssProtection(true));
    }

    private setCORS(): void {
        this.app.use((_, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers",
                "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, " +
                "Access-Control-Request-Method, Access-Control-Request-Headers");
            next();
        });
    }

    private setRoutes(): void {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === "function") {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }

    private setStaticFrontend(): void {
        // Set Static Assets On Frontend: ABSOLUTELY REQUIRED!!!
        this.app.use(
            express.static(path.resolve(__dirname, "client"), { maxAge: 31557600000 })
        );
        // React Router: client-side routing: ABSOLUTELY REQUIRED!!!
        // If request doesn't match api => return the main index.html
        this.app.get("/*", (_, res) => {
            res.sendFile(path.resolve(__dirname, "client", "index.html"), (err) => {
                if (err) {
                    res.status(500).send(err);
                }
            });
        });
    }

    private handleError(): void {
        // Error Handler. Provides full stack - remove for production
        if (process.env.NODE_ENV !== "production") {
            this.app.use(errorHandler());
        }
    }
}
