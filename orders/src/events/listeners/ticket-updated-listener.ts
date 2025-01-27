import { Listener, Subjects, TicketUpdatedEvent } from "@demotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'],msg: Message){
        const {id, title, price, version} = data;

        // Find Ticket by ID
        const ticket = await Ticket.findByEvent({id,version})

        if(!ticket){
            throw new Error("Ticket not found.")
        }
        ticket.set({title,price})
        await ticket.save();

        msg.ack()
    }
}