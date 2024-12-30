import express,{Request, Response} from 'express'
import { Order } from '../models/order'
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@demotickets/common'
const router = express.Router()

router.get('/api/orders/:orderId', requireAuth, async(req: Request, res: Response) => {
        const orderId = req.params.orderId
        
        const order = await Order.findById(orderId).populate('ticket')

        if(!order){
                throw new NotFoundError()
        }

        if(order.userId != req.currentUser?.id) {
                throw new NotAuthorizedError();
        }

        res.status(200).send(order)
})

export {router as showOrderDetailRouter}