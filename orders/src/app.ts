import { errorHandler, NotFoundError, currentUser } from '@demotickets/common'
import cookieSession from 'cookie-session'
import 'express-async-errors';
import express from 'express'
import {json} from 'body-parser'
import { createOrderRouter } from './routes/createOrder';
import { cancelOrderRouter } from './routes/cancelOrder';
import { showAllOrdersRouter } from './routes/showAllOrders';
import { showOrderDetailRouter } from './routes/showOrderDetail';
const app = express()
app.set('trust proxy',true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser as any);
app.use(createOrderRouter);
app.use(cancelOrderRouter);
app.use(showAllOrdersRouter)
app.use(showOrderDetailRouter)
app.all('*',async (req,res) => {
    throw new NotFoundError();
})

app.use(errorHandler as any)

export {app}