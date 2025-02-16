import { OrderCancelledEvent } from "@demotickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    
    // Fabricate OrderCancelledListener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString()
    // Ticket Creation
    const ticket = Ticket.build({
        title: "Test Title",
        price: 2000,
        userId: new mongoose.Types.ObjectId().toHexString()
    })
    ticket.set({orderId: orderId})

    await ticket.save()

    // Fabricate Data
    const data : OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}

it('Updates the ticket, publishes an event and acks the message', async () => {
    
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    // Find Ticket
    const ticket = await Ticket.findById(data.ticket.id);

    expect(ticket).toBeDefined();
    expect(ticket!.orderId).not.toBeDefined()
    expect(ticket!.id).toEqual(data.ticket.id)
    
    expect(msg.ack).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalledTimes(1)
})
