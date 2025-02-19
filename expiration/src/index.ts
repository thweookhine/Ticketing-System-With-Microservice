import { natsWrapper } from "./nats-wrapper"
import { app } from "./app"

const start = async () => {
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS Client ID must be defined.")
    }
    if(!process.env.NATS_URL) {
        throw new Error("NATS url must be defined.")
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS Cluster ID must be defined.")
    }

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
        natsWrapper.client.on('close', () => {
            console.log("NATS connection closed!")
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

    }catch(err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!')
    })
}

start()