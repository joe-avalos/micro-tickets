import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'

// Adding global function to global namespace instead of importing "extra" file
// declare global {
//   namespace NodeJS {
//     interface Global {
//       signup(): Promise<string[]>
//     }
//   }
// }

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
//
// global.signup = async ()=>{
//   const email = 'test@test.com'
//   const password = 'password'
//   const response = await request(app)
//     .post('/api/users/signup')
//     .send({
//       email,
//       password,
//     })
//     .expect(201)
//   return response.get('Set-Cookie')
// }
