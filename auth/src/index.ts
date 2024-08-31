import express from 'express'
import 'express-async-errors'
import {json} from 'body-parser'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signupRouter } from './routes/signup'
import { signoutRouter } from './routes/signout'
import { errorHandler } from './middleware/error-handler'
import { NotFoundError } from './errors/not-found-err'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

const app = express()
app.set('trust proxy',true);
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: true
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*',async (req,res) => {
    throw new NotFoundError();
})

app.use(errorHandler)

const start = async () => {
    try{
        if(!process.env.JWT_KEY){
            throw new Error('JWT_KEY must be defined.')
        }
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log('Mongodb connected.')
    }catch(err){
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!')
    })
}
start();

