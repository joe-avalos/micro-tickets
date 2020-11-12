import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

// Adding global function to global namespace instead of importing "extra" file
declare global {
  namespace NodeJS {
    interface Global {
      signup(id?: string): string[]
    }
  }
}

jest.mock('../nats-wrapper')

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'wtvr'
  mongo = new MongoMemoryServer()
  const mongoURI = await mongo.getUri()
  
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async ()=>{
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections){
    await collection.deleteMany({})
  }
})

afterAll(async ()=>{
  await mongo.stop()
  await mongoose.connection.close()
})

// Declaring global function instead of importing "extra" file where required

global.signup = (id?: string)=>{
  
  // Build a JWT token
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  
  // Build session object {jwt: MY_JWT}
  const session = {jwt: token}
  
  // Turn session into JSON
  const sessionJSON = JSON.stringify(session)
  
  // Encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  
  // return cookie string
  return [`express:sess=${base64}`]
}
