
import {Publisher, Subjects, TicketCreatedEvent} from '@demotickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}