import { OrderCreatedEvent, Publisher, Subjects } from "@demotickets/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}