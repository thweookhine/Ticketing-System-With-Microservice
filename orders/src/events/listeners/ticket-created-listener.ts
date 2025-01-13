import { Listener, Subjects, TicketCreatedEvent } from "@demotickets/common";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'orders-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        
    }
}