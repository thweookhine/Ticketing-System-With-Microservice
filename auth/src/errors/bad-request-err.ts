import { CustomError } from "./custom-err";

export class BadRequestError extends CustomError{
    statusCode = 400;

    constructor(public message: string){
        super(message);
        // Call pnly When we are writing typescript and trying to extend a class that is built in to language.
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeErrors(){
        return [{
            message: 'Bad Request'
        }]
    }
}