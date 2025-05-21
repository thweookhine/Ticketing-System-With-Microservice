import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, ValidateRequest } from '@demotickets/common';
import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments', requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const {orderId, token} = req.body;
    
    const order = await Order.findById(orderId);
    if(!order) {
      throw new NotFoundError();
    }

    if(order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status == OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order')
    }

    res.send({success: true})
  }
)

export {router as createChargeRouter}