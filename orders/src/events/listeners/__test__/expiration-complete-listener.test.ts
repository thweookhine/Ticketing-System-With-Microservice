import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { ExpirationCompleteEvent, OrderStatus } from "@demotickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    

    //Ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()

    // Insert One Order Record
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'alskdfj',
        expiresAt: new Date(),
        ticket,
      });
      await order.save();
    
    const data : ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return {listener, data, message, order, ticket}
}

it('order has been cancelled after expiration complete', async () => {
    const {listener, data, message, order, ticket} = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

})

it('Emit Order-Cancelled Event', async () => {
    const {listener, data, message, order, ticket} = await setup();
    await listener.onMessage(data, message);
    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[1][1]
      );
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    expect(eventData.id).toEqual(order.id)
})

it('Acks the message', async () =>{
    const {listener, data, message, order, ticket} = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
    expect(message.ack).toHaveBeenCalledTimes(1);
})