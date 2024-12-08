import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticket-created-listener'
import { TicketUpdatedListener } from './events/ticket-updated-listener'


console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

//After client or stan successfully connects, NATS streaming server is going to 
//emit a "connect" event

//LISTENING "connect" event
// Function(2nd arg) will be executed after successfully connected to NATS Streaming Server
stan.on('connect',() => {
    console.log('Listener connected to NATS')

    stan.on('close',() => {
        console.log('NATS connection closed!')
        process.exit();
    })

    new TicketCreatedListener(stan).listen()
    new TicketUpdatedListener(stan).listen()
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())

