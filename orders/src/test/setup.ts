import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global{
    var signup: () => Promise<string[]>;
}

beforeAll(async() => {
    process.env.JWT_KEY='asdfasdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
    const collections = await mongoose.connection.db?.collections();
    if(collections){
        for(let collection of collections){
            await collection.deleteMany({});
        }
    }
})

afterAll(async() => {
    if(mongo){
        await mongo.stop()
    }
    await mongoose.connection.close()
})

global.signup = async () => {

    // Build JWT Payload
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create JWT Token
    const token = jwt.sign(payload,process.env.JWT_KEY!)

    // Build Session Object
    const session = {jwt: token}

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string that cookie with encoded data
    return [`session=${base64}`];
}