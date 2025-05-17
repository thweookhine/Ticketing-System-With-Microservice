import { OrderCancelledEvent, OrderStatus } from "@demotickets/common";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 2000,
    status: OrderStatus.Created
  })
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 0,
    ticket: {
      id: 'asdf'
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}

it('cancels order', async() => {
  const {listener, data, msg} = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const {listener, data, msg} = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled()
})