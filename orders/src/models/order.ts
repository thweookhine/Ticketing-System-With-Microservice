import mongoose from "mongoose";
import { TicketDoc } from "./ticket";
import { OrderStatus } from "@demotickets/common";

export {OrderStatus}

interface OrderAttrs {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc
}

interface OrderDoc extends Document{
    userId: string,
    status: OrderStatus,
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
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
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