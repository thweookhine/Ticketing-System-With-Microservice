import express, { Response } from 'express'
import { body, validationResult } from 'express-validator'
import { Request } from 'express-validator/lib/base';
import { ValidateRequest, BadRequestError } from '@demotickets/common';
import { User } from '../models/user';
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
],ValidateRequest as any, async (req: Request,res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(!existingUser) {
        throw new BadRequestError("Invalid Credentials");
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
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