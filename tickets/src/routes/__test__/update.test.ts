import mongoose from 'mongoose'
import { app } from '../../app'
import request from 'supertest';
import jwt from 'jsonwebtoken'
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided ID does not exist', async() => {
    const cookie = await global.signup()
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
            .put(`/api/tickets/${id}`)
            .set('Cookie', cookie)
            .send({
                title: 'Title',
                price: 20
            })
            .expect(404);
})

it('returns a 401 if the user is not authenticated', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
            .put(`/api/tickets/${id}`)
            .send({
                title: 'Title',
                price: 20
            })
            .expect(401);
})

it('returns a 401 if the user does not own the ticket', async() => {
    const cookie = await global.signup();
    const id = new mongoose.Types.ObjectId().toHexString();
    const createResponse = await request(app)
        .post(`/api/tickets`)
        .set('Cookie',cookie)
        .send({
            title: 'Title',
            price: 20
        })
    .expect(201);

    const newCookie = await global.signup();

    const response = await request(app)
            .put(`/api/tickets/${createResponse.body.id}`)
            .set('Cookie', newCookie)
            .send({
                title: 'UpdateTest',
                price: 2000
            })
            .expect(401);
    
})

it('returns a 400 if the user provides an invalid title or price', async() => {
    const cookie = await global.signup()
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'Test',
            price: 20
        })
    .expect(201);

    //Test with invalid title
    const invalidTitleRes = await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                price: 20
            })
            .expect(400);

    expect(invalidTitleRes.body.errors[0].message).toEqual('Title is required')
    expect(invalidTitleRes.body.errors[0].field).toEqual('title')

    // Test with invalid price
    const invalidPriceRes = await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'Test',
                price: -200
            })
            .expect(400);
    expect(invalidPriceRes.body.errors[0].message).toEqual('Price must be provided and must be greater than 0')
    expect(invalidPriceRes.body.errors[0].field).toEqual('price')
})

it('updates the ticket provided valid inputs.', async() => {
    const cookie = await global.signup();

    const createResponse = await request(app)
                                .post('/api/tickets')
                                .set('Cookie',cookie)
                                .send({
                                    title: 'Test',
                                    price: 200
                                })
                                .expect(201)
    
    const response = await request(app)
                                .put(`/api/tickets/${createResponse.body.id}`)
                                .set('Cookie',cookie)
                                .send({
                                    title: 'Test Title',
                                    price: 157.35
                                })
                                .expect(200);
    
    const ticketData = await request(app)
                                .get(`/api/tickets/${response.body.id}`)
                                .send()

    expect(ticketData.body.id).toEqual(createResponse.body.id)
    expect(ticketData.body.title).toEqual('Test Title')
    expect(ticketData.body.price).toEqual(157.35)
})

it('publishes an event', async () => {
    const cookie = await global.signup();

    const createResponse = await request(app)
                                .post('/api/tickets')
                                .set('Cookie',cookie)
                                .send({
                                    title: 'Test',
                                    price: 200
                                })
                                .expect(201)
    
    const response = await request(app)
                                .put(`/api/tickets/${createResponse.body.id}`)
                                .set('Cookie',cookie)
                                .send({
                                    title: 'Test Title',
                                    price: 157.35
                                })
                                .expect(200);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects update if ticket is already reserved', async () => {

    const cookie = await global.signup();

    const createResponse = await request(app)
                                .post('/api/tickets')
                                .set('Cookie',cookie)
                                .send({
                                    title: 'Test',
                                    price: 200
                                })
                                .expect(201)

    const ticket = await Ticket.findById(createResponse.body.id);
    ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()})
    await ticket!.save();
    
    const response = await request(app)
                                .put(`/api/tickets/${createResponse.body.id}`)
                                .set('Cookie',cookie)
                                .send({
                                    title: 'Test Title',
                                    price: 157.35
                                })
                                .expect(400);

})