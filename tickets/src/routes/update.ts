import { NotAuthorizedError, NotFoundError, requireAuth, ValidateRequest } from '@demotickets/common';
import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',requireAuth, 
    [
        body('title').not().notEmpty().withMessage('Title is required'),
        body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
    ],
    ValidateRequest,
    async(req: Request, res: Response) => {

    const id = req.params.id;
    const ticket = await Ticket.findById(id);
    if(!ticket){
        throw new NotFoundError();
    }

    if(req.currentUser && ticket.userId != req.currentUser.id){
        throw new NotAuthorizedError();
    }

    const {title, price} = req.body;
    await ticket.save();
    res.status(200).send(ticket)


})

export {router as updateTicketRouter}