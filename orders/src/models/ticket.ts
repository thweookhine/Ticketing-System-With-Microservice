import mongoose, { version } from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An Interface that describes the properties
// that are required to create new Ticket
interface TicketAttrs{
    id: string,
    title: string,
    price: number
}

interface TicketDoc extends mongoose.Document{
    title: string,
    price: number,
    version: number,
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null> 
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
})

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.set('toJSON', {
    transform(doc,ret){
        ret.id = ret._id
        delete ret._id
    }
})

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
}
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema)

export {Ticket,TicketDoc}