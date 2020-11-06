import express from 'express'
import {currentUser} from '@boloyde-gittix/common'

const router = express.Router()

router.post('/api/users/signout',
  currentUser,
  (req, res) => {
    req.session = null
    res.send({})
  })

export {router as signoutRouter}
