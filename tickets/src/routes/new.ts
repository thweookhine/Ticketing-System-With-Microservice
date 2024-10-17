import express from 'express'
const router = express.Router()

router.post('/api/tickets',(req,res) => {
    res.status(200).json({});
})

export {router as createTicketRouter}