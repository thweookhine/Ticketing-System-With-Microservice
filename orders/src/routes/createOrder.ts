import { requireAuth, ValidateRequest } from '@demotickets/common'
import express, {Request,Response} from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/api/orders',requireAuth,
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided.'),
    ValidateRequest,
    async (req: Request, res: Response) => {
        res.send({})
    }
)

export {router as createOrderRouter}
