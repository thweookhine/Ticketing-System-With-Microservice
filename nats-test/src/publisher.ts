import nats from 'node-nats-streaming'

const stan = nats.connect('ticketing','abc',{
    url: 'http://localhost:4222'
})

//After client or stan successfully connects, NATS streaming server is going to 
//emit a "connect" event

//LISTENING "connect" event
// Function(2nd arg) will be executed after successfully connected to NATS Streaming Server
stan.on('connect', () =>{
    console.log('Publisher connected to NATS')
})