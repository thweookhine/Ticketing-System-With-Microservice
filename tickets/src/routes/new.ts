import { requireAuth } from '@demotickets/common';
import express from 'express'
const router = express.Router()

router.post('/api/tickets',requireAuth as any,(req,res) => {
    res.status(200).json({});
})

export {router as createTicketRouter}