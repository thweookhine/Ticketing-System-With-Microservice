import {Listener, OrderCreatedEvent, Subjects} from '@demotickets/common'
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import {Order} from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      version: data.version,
      userId: data.userId,
      status: data.status
    });

    await order.save();

    msg.ack()
  }
}