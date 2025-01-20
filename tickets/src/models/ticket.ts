import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create new Ticket
interface TicketAttrs{
    title: string,
    price: number,
    userId: string
}

interface TicketMdoel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that Ticket Document has
interface TicketDoc extends mongoose.Document{
    title: string,
    price: number,
    userId: string,
    version: number
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

ticketSchema.set('toJSON', {
    transform(doc,ret){
        ret.id = ret._id
        delete ret._id
    }
})
ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc,TicketMdoel>('Ticket',ticketSchema);

export {Ticket}