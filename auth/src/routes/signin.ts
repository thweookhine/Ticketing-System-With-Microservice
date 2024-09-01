import express, { Response } from 'express'
import { body, validationResult } from 'express-validator'
import { Request } from 'express-validator/lib/base';
import { RequestValidationError } from '../errors/request-validation-error';
import { ValidateRequest } from '../middleware/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-err';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post('/api/users/signin',[
    body('email')
    .isEmail()
    .withMessage("Email must be valid."),
    body('password')
    .trim()
    .notEmpty()
    .withMessage("You must supply a password.")
],ValidateRequest, async (req: Request,res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(!existingUser) {
        throw new BadRequestError("Invalid Credentials");
    }

    const passwordMatch = Password.compare(existingUser.password, password);
    if(!passwordMatch) {
        throw new BadRequestError("Invalid Credentials");
    }

    // Generate JWT
    const userJWT = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!)

    // Store generated JWT on cookie
    req.session = {
        jwt: userJWT
    }

    res.status(200).send(existingUser);
})

export {router as signinRouter}