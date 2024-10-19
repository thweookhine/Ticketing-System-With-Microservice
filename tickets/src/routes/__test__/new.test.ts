import request from 'supertest'
import {app} from '../../app'
import { cookie } from 'express-validator';

it('has a route handler listening to /api/tickets for post request.', async() => {
    const response = await request(app)
                        .post('/api/tickets')
                        .send({});
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
    await request(app)
            .post('/api/tickets')
            .send({})
            .expect(401)
})

it('returns a status other than 401 if the user is signed in', async() => {
    const cookie = await global.signup()
    const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({});
    console.log(response.status)
    expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided.', async () => {
    const cookie = await global.signup();

    await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title: '',
                price: 10
            })
            .expect(400);

    await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                price: 10
            })
            .expect(400)
})

it('returns an error if an invalid price is provided.',async () => {
    const cookie = await global.signup();

    await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title: 'Title',
                price: -10  
            })
            .expect(400);
    
    await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: 'Title'
            })
})

it('creates a ticket with valid inputs.',async () => {
    const cookie = await global.signup();

    await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: 'test@test.com',
                price: 20
            })
            .expect(201)
})