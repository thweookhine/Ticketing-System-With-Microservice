import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {app} from '../app'
import request from 'supertest'

let mongo: any

declare global{
    var signup: () => Promise<string[]>
}

beforeAll(async() => {
    process.env.JWT_KEY="asdfasdf"
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    console.log("Mongo URI => "+mongoUri)
    await mongoose.connect(mongoUri, {})
});

beforeEach(async() => {
    const collections = await mongoose.connection.db?.collections();
    if(collections){
        for(let collection of collections){
            await collection.deleteMany({})
        }
    }

})

afterAll(async () => {
    if(mongo){
        await mongo.stop()
    }
    await mongoose.connection.close()
})

global.signup = async () => {
    const email = 'test@test.com'
    const password = 'password'
    
    const response = await request(app)    
                            .post('/api/users/signup')
                            .send({
                                email,password
                            })
                            .expect(201);
    const cookie = response.get('Set-Cookie') as string[];
    return cookie;
}