import { TicketCreatedEvent } from "@demotickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener"
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";


const setup = async () => {
    // creating instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // Fabricating a fake data event object
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Test Title',
        price: 2500,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    // Fabricating a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return {listener, data, message}
}

it('creates and saves a ticket', async() => {

    // Set listener, data and message
    const {listener, data, message} = await setup();

    // Call "onMessage" Function
    await listener.onMessage(data,message);

    // Writing assertions for ticket creation
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.id).toEqual(data.id);
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    expect(ticket!.version).toEqual(data.version)

})

it('acks the message', async() => {
    
    // Set listener, data and message
    const {listener, data, message} = await setup();

    // Call "onMessage" Function
    await listener.onMessage(data, message);

    // Writing asserstions to make sure "ack" function is called
    expect(message.ack).toHaveBeenCalled();
    expect(message.ack).toHaveBeenCalledTimes(1);
})