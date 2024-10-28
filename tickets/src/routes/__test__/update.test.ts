import mongoose from 'mongoose'
import { app } from '../../app'
import request from 'supertest';

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
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
            .put(`/api/tickets/${id}`)
            .send({
                title: 'Title',
                price: 20
            })
            .expect(401);
})

it('returns a 400 if the user provides an invalid title or price', async() => {
    // const cookie = await global.signup()
    // const id = new mongoose.Types.ObjectId().toHexString();
    // await request(app)
    //         .put(`/api/tickets/${id}`)
    //         .set('Cookie', cookie)
    //         .send({
    //             price: 20
    //         })
    //         .expect(400);

    // await request(app)
    //         .put(`/api/tickets/${id}`)
    //         .set('Cookie', cookie)
    //         .send({
    //             title: 'Test'
    //         })
    //         .expect(400);
})

it('updates the ticket provided valid inputs.', async() => {

})