import { ValidationError } from "express-validator";
import { CustomError } from "./custom-err";

export class RequestValidationError extends CustomError{
    statusCode = 400;
    constructor(public errors: ValidationError[]){
        super("Invalid Request Data")

        // Call pnly When we are writing typescript and trying to extend a class that is built in to language.
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors(){
        return this.errors.map(error => {
            if(error.type === 'field'){
                return {message: error.msg, field: error.path}
            }

            return { message: error.msg };
        })
    }
}
