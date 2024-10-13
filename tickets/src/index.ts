import {app} from './app'
import mongoose from 'mongoose'
const start = async () => {
    try{
        if(!process.env.JWT_KEY) {
            throw new Error('JWT_KEY must be defined.')
        }
        await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets");
        console.log('Mongodb connected.')
    }catch(err){
        console.log(err);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!')
    })
}

start()