import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";


const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price:20
    })

    await ticket.save()

    return ticket;
}

it('Fetch orders from particular user', async () => {

    const user1 = await global.signup();
    const user2 = await global.signup();

    //Create Three tickets
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    // Create Order   
    await request(app)
       .post('/api/orders')
       .set('Cookie',user1)
       .send({
           ticketId: ticket1.id
       })
       .expect(201) 

       // Create Order   
    await request(app)
        .post('/api/orders')
        .set('Cookie',user1)
        .send({
            ticketId: ticket3.id
        })
        .expect(201) 

    // Create Order   
    await request(app)
       .post('/api/orders')
       .set('Cookie',user2)
       .send({
           ticketId: ticket2.id
       })
       .expect(201)

    // Get 2 Orders by User1
    const responseByUser1 = await request(app)
                                    .get('/api/orders')
                                    .set('Cookie',user1)
                                    .expect(200);

    expect(responseByUser1.body.length).toEqual(2);
    expect(responseByUser1.body[0].ticket.title).toEqual('concert')   
    expect(responseByUser1.body[1].ticket.title).toEqual('concert')   

    // Get 1 Order by User2
    const responseByUser2 = await request(app)
                                    .get('/api/orders')
                                    .set('Cookie',user2)
                                    .expect(200);

    expect(responseByUser2.body.length).toEqual(1);
    expect(responseByUser1.body[0].ticket.title).toEqual('concert') 

    // Get no order by User3
    const responseByUser3 = await request(app)
                                    .get('/api/orders')
                                    .set('Cookie',await global.signup())
                                    .expect(200);

    expect(responseByUser3.body.length).toEqual(0);


})