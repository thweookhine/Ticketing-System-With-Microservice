import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { cookie } from 'express-validator'

it('has a route handler listening to /api/orders/:orderId', async () => {
    const orderId = new mongoose.Types.ObjectId()
    const response = await request(app)
            .get(`/api/orders/${orderId}`)
            .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async() => {
    const orderId = new mongoose.Types.ObjectId()
    const response = await request(app)
                                .get(`/api/orders/${orderId}`)
                                .send({});
    expect(response.status).toEqual(401)
})

it('returns an error if order is not fouond', async() => {
    const cookie = await global.signup()
    const orderId = new mongoose.Types.ObjectId()
    const response = await request(app)
                                .get(`/api/orders/${orderId}`)
                                .set('Cookie',cookie)
                                .send({});
    expect(response.status).toEqual(404)
})

it('return error when fetching Order by Other User', async () => {
    
    
    // Create Order by User1

    // Create One Ticket
    const user1 = await global.signup();
    const ticket = Ticket.build({
        title: 'Ticket',
        price: 200
       })
    
    await ticket.save();

    // Create Order   
    const orderResponse = await request(app)
       .post('/api/orders')
       .set('Cookie',user1)
       .send({
           ticketId: ticket.id
       })
    
    // Fetch Order by Other User
    const response = await request(app)
                            .get(`/api/orders/${orderResponse.body.id}`)
                            .set('Cookie', await global.signup())
                            .send({})
                            .expect(401)
})

it('Successfully Fetch order by Order ID', async () => {
    // Create Order by User1

    // Create One Ticket
    const user1 = await global.signup();
    const ticket = Ticket.build({
        title: 'Ticket',
        price: 200
       })
    
    await ticket.save();

    // Create Order   
    const orderResponse = await request(app)
       .post('/api/orders')
       .set('Cookie',user1)
       .send({
           ticketId: ticket.id
       })
    
    // Fetch Order by Other User
    const response = await request(app)
                            .get(`/api/orders/${orderResponse.body.id}`)
                            .set('Cookie', user1)
                            .send({})
                            .expect(200)
})