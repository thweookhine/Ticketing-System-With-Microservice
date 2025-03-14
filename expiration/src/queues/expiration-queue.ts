import Queue from 'bull'

//To define exact data type for queue
interface Payload {
    orderId: string;
}

// 1st arg => channel name, 2nd arg => options to connect to redis server instance
const expirationQueue = new Queue<Payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    console.log("Wanna publish expiration:complete for OrderID", job.data.orderId);
})

export {expirationQueue}
