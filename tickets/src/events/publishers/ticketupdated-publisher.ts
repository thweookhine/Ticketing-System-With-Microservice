import { Publisher, Subjects, TicketUpdatedEvent } from "@demotickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}