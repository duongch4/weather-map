import supertest from "supertest";
import { ExpressServer } from "../ExpressServer";

describe(
    "GET /", () => {
        it("should return 200 OK", () => {
            return supertest(new ExpressServer().getApp()).get("/").expect(200);
        });
    }
);
