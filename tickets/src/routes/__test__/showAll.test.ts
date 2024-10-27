import request from "supertest"
import {app} from '../../app'

const createTicket = async (title: string,price: number) => {
    const cookie = await global.signup();
    return request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title: "title",
                price: 200
            })
}

it('can fetch a list of tickets',async () => {
    await createTicket('Ticket1',3000.0);
    await createTicket('Ticket2', 4000.50);
    await createTicket('Ticket3', 500);

    const response = await request(app).get('/api/tickets').send().expect(200);
    console.log(response.body)
    expect(response.body.length).toEqual(3)
})