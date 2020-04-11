class BaseCustomException extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

export class EmptyException extends BaseCustomException { }
export class InvalidLengthException extends BaseCustomException { }
export class NotMatchException extends BaseCustomException { }
