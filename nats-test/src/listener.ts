import nats, {Message} from 'node-nats-streaming'
import { randomBytes } from 'crypto'

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

    // After creating subscription, we can receive data through this subscription
    const subscription = stan.subscribe('ticket:created','order-service-queue-group')

    // Message refersm to events
    subscription.on('message', (msg : Message) => {
        const data = msg.getData();

        if(typeof data === 'string'){
            console.log(
                `Received event #${msg.getSequence()}, with data: ${data}`
            )
        }
    })
})