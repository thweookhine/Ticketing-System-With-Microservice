import mongoose from "mongoose";

// An Interface that describes the properties
// that are required to create new Ticket
interface TicketAttrs{
    title: string,
    price: number
}

interface TicketDoc extends mongoose.Document{
    title: string,
    price: number
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

ticketSchema.set('toJSON', {
    transform(doc,ret){
        ret.id = ret._id
        delete ret._id
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema)

export {Ticket,TicketDoc}