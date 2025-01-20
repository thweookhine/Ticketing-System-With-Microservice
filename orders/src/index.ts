import {app} from './app'
import mongoose from 'mongoose'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined.')
    }
    if(!process.env.MONGO_URI){
        throw new Error('Mongo URI must be defined.')
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS Client ID must be defined.')
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS url must be defined.')
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS cluster ID must be defined.')
    }
    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongodb connected.')

    }catch(err){
        console.log(err);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!')
    })
}

start()