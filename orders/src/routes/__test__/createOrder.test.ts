import request from "supertest"
import {app} from '../../app'
import { cookie } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it('has a route handler listening to /api/orders for order', async() => {   
    const response = await request(app)
        .post('/api/orders')
        .send({});

    expect(response.status).not.toEqual(404)
})

it('returns an error if an invalid ticketId is provided.', async () => {
    const cookie = await global.signup();

    const response = await request(app)
            .post('/api/orders')
            .set('Cookie',cookie)
            .send({
                ticketId: ''
            })
            .expect(400)

    await request(app)
            .post('/api/orders')
            .set('Cookie',cookie)
            .send({

            })
            .expect(400)
    
})

it('can only be accessed if the user is signed in', async() => {
    await request(app)
            .post('/api/orders')
            .send({})
            .expect(401)
})

it('returns an error if ticket is not found', async() => {
    const cookie = await global.signup();
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
            .post('/api/orders')
            .set('Cookie',cookie)
            .send({
                ticketId: ticketId
            })
            .expect(404)
})

it('returns an error if ticket is already reserved.', async() => {
   const cookie = await global.signup();
   const ticket = Ticket.build({
    title: 'Ticket',
    price: 200
   })

   await ticket.save();

   const response = await request(app)
            .post('/api/orders')
            .set('Cookie',cookie)
            .send({
                ticketId: ticket.id
            })
            .expect(201)
    
    await request(app)
            .post('/api/orders')
            .set('Cookie',cookie)
            .send({
                ticketId: ticket.id
            })
            .expect(400)
})

it('create order successfully with valid inputs', async() => {
    const cookie = await global.signup();
    
    // Create One Ticket
    const ticket = Ticket.build({
        title: 'Ticket',
        price: 200
       })
    
       await ticket.save();

    // Create Order   
    const response = await request(app)
       .post('/api/orders')
       .set('Cookie',cookie)
       .send({
           ticketId: ticket.id
       })
       .expect(201) 
})

it.todo('emits an order created event')