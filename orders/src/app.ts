import express from 'express'
import 'express-async-errors'
import {json} from 'body-parser'
import cookieSession from 'cookie-session'
import {errorHandler, NotFoundError, currentUser} from '@boloyde-gittix/common'

import {newOrderRouter} from './routes/new'
import {indexOrderRouter} from './routes/index'
import {showOrderRouter} from './routes/show'
import {cancelOrderRouter} from './routes/cancel'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
)
app.use(currentUser)

app.use(newOrderRouter)
app.use(indexOrderRouter)
app.use(showOrderRouter)
app.use(cancelOrderRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export {app}
