import { OrderCreatedEvent, OrderStatus } from "@demotickets/common"
import mongoose from "mongoose"
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {

    // Creating Listener instance
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Ticket Creation
    const ticket = Ticket.build({
        title: "Test Title",
        price: 2000,
        userId: new mongoose.Types.ObjectId().toHexString()
    })

    // save created ticket to db.
    await ticket.save()

    // Fabricating OrderCreatedEventData
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        expiresAt: (new Date().getDate() + 3).toString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // Fabricating fack msg
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}

it('Reserved Ticket', async() => {
    const {listener, data, msg} = await setup();

    // calls onMessage
    await listener.onMessage(data, msg);

    // Find ticket by id
    const ticket = await Ticket.findById(data.ticket.id);

    // Check ticket data
    expect(ticket).toBeDefined()
    expect(ticket!.id).toEqual(data.ticket.id)
    expect(ticket!.orderId).toEqual(data.id)
    expect(ticket!.price).toEqual(data.ticket.price)

})

it('acks the message', async() => {
    const {listener, data, msg} = await setup();

    // calls onMessage
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalledTimes(1)

})

it('Does not invoke ack if Ticket not found error', async() => {

    const {listener, data, msg} = await setup();

    // Set new ticketId
    data.ticket.id = new mongoose.Types.ObjectId().toHexString();

    try{
        await listener.onMessage(data, msg);
    }catch(err){

    }

    expect(msg.ack).not.toHaveBeenCalled()

})