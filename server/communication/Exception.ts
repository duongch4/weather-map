import { TResponse } from "./TResponse";

class BaseCustomException extends Error {
    public readonly response: TResponse;

    constructor(
        message: string, payload: object = {}, status = "Known Exception", code = 400
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.response = {
            status: status,
            code: code,
            payload: payload,
            message: message
        };
    }
}

export class NotFoundException extends BaseCustomException {
    constructor(
        message: string, payload: object = {}, status = "Not Found Exception", code = 404
    ) {
        super(message, payload, status, code);
    }
}

export class InternalServerException extends BaseCustomException {
    constructor(
        message: string, payload: object = {}, status = "Internal Server Exception", code = 500
    ) {
        super(message, payload, status, code);
    }
}
