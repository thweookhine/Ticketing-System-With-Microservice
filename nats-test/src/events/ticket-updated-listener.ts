import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";
import { TicketUpdatedEvent } from "./ticket-updated-event";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName= "payment-service"

    onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        console.log('Event data: ',data)

        console.log(data.id)
        console.log(data.title)
        console.log(data.price)
        msg.ack();
    }
}