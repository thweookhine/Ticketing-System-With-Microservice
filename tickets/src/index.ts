import {app} from './app'
import mongoose from 'mongoose'
const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined.')
    }
    if(!process.env.MONGO_URI){
        throw new Error('Mongo URI must be defined.')
    }
    try{
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