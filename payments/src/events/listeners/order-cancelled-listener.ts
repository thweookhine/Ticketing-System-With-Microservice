import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@demotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findById(data.id);

    if(!order) {
      throw new Error('Order is not found!')
    }

    order.set({status: OrderStatus.Cancelled})

    await order.save();

    msg.ack();
  }
}