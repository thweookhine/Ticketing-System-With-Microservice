import { NotAuthorizedError, NotFoundError, requireAuth, ValidateRequest } from '@demotickets/common';
import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticketupdated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id',requireAuth, 
    [
        body('title').not().notEmpty().withMessage('Title is required'),
        body('price').isFloat({gt: 0}).withMessage('Price must be provided and must be greater than 0')
    ],
    ValidateRequest,
    async(req: Request, res: Response) => {

    const id = req.params.id;
    const ticket = await Ticket.findById(id);
    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId != req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    ticket.set({
        title: req.body.title,
        price: req.body.price
    })
    await ticket.save()
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })
    res.status(200).send(ticket)

})

export {router as updateTicketRouter}