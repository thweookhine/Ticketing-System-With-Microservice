import { errorHandler, NotFoundError, currentUser } from '@demotickets/common'
import cookieSession from 'cookie-session'
import 'express-async-errors';
import express from 'express'
import {json} from 'body-parser'
import { createTicketRouter } from './routes/new'
import { showTicketDetailRouter } from './routes/showDetail'
import { showAllTicketsRouter } from './routes/showAll';
const app = express()
app.set('trust proxy',true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser as any);
app.use(createTicketRouter);
app.use(showTicketDetailRouter);
app.use(showAllTicketsRouter)
app.all('*',async (req,res) => {
    throw new NotFoundError();
})

app.use(errorHandler as any)

export {app}