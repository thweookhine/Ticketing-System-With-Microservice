import { CustomError } from "./custom-err";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not Authorized');
        // Call pnly When we are writing typescript and trying to extend a class that is built in to language.
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    serializeErrors(){
        return ([
            {'message': 'Not Authorized'}
        ])
    }
}