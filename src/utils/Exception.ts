class BaseCustomException extends Error {
    public code: number;
    public status: string;
    constructor(message: string, code: number, status: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

export class NotFoundException extends BaseCustomException {
    constructor(message: string) {
        super(message, 404, "Not Found Exception");
    }
 }

