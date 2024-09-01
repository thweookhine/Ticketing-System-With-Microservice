import express, {Request, Response} from 'express'
import {body,validationResult} from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-err';
import jwt from 'jsonwebtoken';
import { ValidateRequest } from '../middleware/validate-request';
const router = express.Router()

router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid.'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters.')
],ValidateRequest, async(req: Request,res: Response) => {

    const {email,password} = req.body;

    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new BadRequestError("Email in use");
    }

    const user = User.build({email,password})
    await user.save();

    // Generate JWT
    const userJWT = jwt.sign({
        id: user.id,
        email: user.email
    },process.env.JWT_KEY!)

    // Store generated JWT on cookie
    req.session = {
        jwt: userJWT
    }

    res.status(200).json(user)
})

export {router as signupRouter}