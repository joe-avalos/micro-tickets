import express from 'express'
import 'express-async-errors'
import {json} from 'body-parser'
import mongoose from 'mongoose'

import {currentUserRouter} from './routes/current-user'
import {signupRouter} from './routes/signup'
import {signinRouter} from './routes/signin'
import {signoutRouter} from './routes/signout'
import {NotFoundError} from './errors/not-found-error'
import {errorHandler} from './middleware/error-handling'

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
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
