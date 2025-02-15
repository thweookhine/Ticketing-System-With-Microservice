import { Listener, OrderCancelledEvent, Subjects } from "@demotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketupdated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        
        // Find Ticket By ticket id
        const ticket = await Ticket.findById(data.ticket.id);

        // If ticket is not found, throw error
        if(!ticket) {
            throw new Error("Ticket is not found.")
        }

        // Remove OrderId from ticket
        ticket.set({orderId: undefined})
        // ticket.orderId = "";

        // Save Ticket
        await ticket.save();

        // Publish ticket update event
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })

        // Ack the message
        msg.ack()
    }
}