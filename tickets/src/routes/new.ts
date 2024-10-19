import { requireAuth, ValidateRequest } from '@demotickets/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
const router = express.Router()

router.post('/api/tickets',requireAuth as any, 
    [
        body('title').not().notEmpty().withMessage('Title is required.'),
        body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
    ]
    ,ValidateRequest as any,(req: Request,res: Response) => {
    res.status(200).json({});
})

export {router as createTicketRouter}