import { OrderCancelledEvent } from "@demotickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    
    // Fabricate OrderCancelledListener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // Ticket Creation
    const ticket = Ticket.build({
        title: "Test Title",
        price: 2000,
        userId: new mongoose.Types.ObjectId().toHexString()
    })

    await ticket.save()

    // Fabricate Data
    const data : OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
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

it('Cancels Ticket', async () => {
    
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.ticket.id);

    expect(ticket).toBeDefined();
    // expect(ticket!.id).toEqual(data.ticket.id);
    expect(ticket!.orderId).toEqual(data.id)

})
