import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found.', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
            .get(`/api/ticketsfe/${id}`)
            .send()
            .expect(404)
    console.log(response.body)
})

it('returns a ticket if the ticket is found', async () => {
    const ticket = {
        title: 'Title',
        price: 200
    }

    const cookie = await global.signup()

    // Create one new ticket
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send(ticket)
        .expect(201)

    const ticketResponse = await request(app)
                            .get(`/api/tickets/${response.body.id}`)
                            .send()
                            .expect(200)
    expect(ticketResponse.body.title).toEqual(ticket.title);
    expect(ticketResponse.body.price).toEqual(ticket.price)
})
