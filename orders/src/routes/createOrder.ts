import { BadRequestError, NotFoundError, OrderStatus, requireAuth, ValidateRequest } from '@demotickets/common'
import express, {Request,Response} from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS=15*60

router.post('/api/orders',requireAuth,
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided.'),
    ValidateRequest,
    async (req: Request, res: Response) => {
        
        const {ticketId} = req.body

        // Find the ticket the user is trying to order in database
        const ticket = await Ticket.findById(ticketId)

        if(!ticket){
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved.
        const isReserved = await ticket.isReserved();

        if(isReserved){
            throw new BadRequestError("Ticket is already reserved.")
        }

        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
        
        //Build Order and Save that order to DB
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        });

        await order.save();

        // Publish Event
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            userId: order.userId,
            status: order.status,
            expiresAt: JSON.stringify(order.expiresAt),
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            }
        })

        res.status(201).send(order);
    }
)

export {router as createOrderRouter}
