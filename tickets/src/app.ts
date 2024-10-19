import { currentUser, errorHandler, NotFoundError } from '@demotickets/common'
import cookieSession from 'cookie-session'
import express, { json } from 'express'
import { createTicketRouter } from './routes/new'
import { showTicketDetailRouter } from './routes/showDetail'
const app = express()
app.set('trust proxy',true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser as any);
app.use(createTicketRouter);
app.use(showTicketDetailRouter)
app.all('*',async (req,res) => {
    throw new NotFoundError();
})

app.use(errorHandler as any)
export {app}