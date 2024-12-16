import mongoose from "mongoose";
import { TicketDoc } from "./ticket";

interface OrderAttrs {
    userId: string,
    status: string,
    expiresAt: Date,
    ticket: TicketDoc
}

interface OrderDoc extends Document{
    userId: string,
    status: string,
    expiresAt: Date,
    ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
})

orderSchema.set('toJSON', {
    transform(doc,ret){
        ret.id = ret._id
        delete ret._id
    }
})

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema);

export {Order}