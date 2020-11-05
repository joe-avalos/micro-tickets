import mongoose from 'mongoose'

import {app} from './app'

const start = async () => {
  if (!process.env.JWT_KEY){
    throw new Error('JWT_KEY is not defined.')
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch (e) {
    console.error(e)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

start()
