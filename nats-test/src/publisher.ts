import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()
const stan = nats.connect('ticketing','abc',{
    url: 'http://localhost:4222'
})

//After client or stan successfully connects, NATS streaming server is going to 
//emit a "connect" event

//LISTENING "connect" event
// Function(2nd arg) will be executed after successfully connected to NATS Streaming Server
stan.on('connect', async() =>{
    console.log('Publisher connected to NATS')
    
    const publisher = new TicketCreatedPublisher(stan);
    try{
        await publisher.publish({
            id: '123',
            title: 'title',
            price: 20
        })
    }catch(err){
        console.error(err)
    }
})
