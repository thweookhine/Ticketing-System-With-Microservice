import request from "supertest";
import {app} from '../../app'
import { ExpressValidator } from "express-validator";

it('clears the cookie after signing out', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);

    const response = await request(app)
            .post('/api/users/signout')
            .send({})
            .expect(200);

    expect(response.headers["set-cookie"][0]).toMatch(new RegExp("^session=;.*"));
})