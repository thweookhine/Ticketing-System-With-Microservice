import { requireAuth, ValidateRequest } from '@demotickets/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
const router = express.Router()

router.post('/api/tickets',requireAuth as any, 
    [
        body('title').not().notEmpty().withMessage('Title is required.'),
        body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
    ]
    ,ValidateRequest as any
    ,async (req: Request,res: Response) => {
    const {title,price} = req.body
    const ticket = Ticket.build({title,price,userId: req.currentUser!.id})
    await ticket.save()
    res.status(201).send(ticket)
})

export {router as createTicketRouter}