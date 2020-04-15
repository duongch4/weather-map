import { ExpressServer } from "./ExpressServer";

const port = process.env.PORT || "3000";
let server = new ExpressServer().listen(port);

if (module.hot) {
    // module.hot.accept("./ExpressServer");
    module.hot.accept("./ExpressServer", () => {
        server.close();
        server = new ExpressServer().listen(port);
    });
}
