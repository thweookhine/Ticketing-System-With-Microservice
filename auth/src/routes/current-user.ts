import express from 'express'
import jwt from "jsonwebtoken"
import { currentUser } from '@demotickets/common'

const router = express.Router()

router.get('/api/users/currentuser', currentUser as any, (req,res) => {
   res.send({currentUser: req.currentUser || null})
})

export {router as currentUserRouter}