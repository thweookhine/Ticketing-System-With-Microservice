import { OrderCancelledEvent, Publisher, Subjects } from "@demotickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}