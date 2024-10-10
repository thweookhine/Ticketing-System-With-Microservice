import express, {Request, Response} from 'express'
import {body,validationResult} from 'express-validator'
import { RequestValidationError, DatabaseConnectionError, BadRequestError, ValidateRequest } from '@demotickets/common'
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
const router = express.Router()

router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid.'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters.')
],ValidateRequest as any, async(req: Request,res: Response) => {

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

    res.status(201).json(user)
})

export {router as signupRouter}