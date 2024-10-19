import request from 'supertest'
import {app} from '../../app'

it('returns a 404 if the ticket is not found.', async () => {
    await request(app)
            .get('/api/tickets/9999')
            .send()
            .expect(404);
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
