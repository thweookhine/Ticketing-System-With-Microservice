import { TicketUpdatedEvent } from "@demotickets/common";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";


const setup = async () => {

    // Creating Instance of Listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Insert One Record
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'First Ticket',
        price: 1000
    })

    await ticket.save();

    // Fabricating Fake Data Object
    const data : TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: "Updated Title",
        price: 2000,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: ticket.version + 1
    }

    // Fabricating Message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, ticket}
}

it('Find and Update a ticket!', async () => {
    
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    // setup listener, data and msg
    const {listener, data, msg, ticket} = await setup();

    await listener.onMessage(data, msg);

    // Find Ticket by id
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version)
})


it('Acks a message!', async () => {
    
    // setup listener, data and msg
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalledTimes(1);
})

it('Does not call ack if event has skipped version',async() =>{

    const {listener, data, msg} = await setup()

    data.version = 999;

    try{
        await listener.onMessage(data, msg);
    }catch(err){
    }
    expect(msg.ack).not.toHaveBeenCalled()
})