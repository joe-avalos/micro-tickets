import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {Order} from '../../models/order'
import {OrderStatus} from '@boloyde-gittix/common'

it('should return 404 when order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'sofh98hs',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404)
})

it('should return a 401 when purchasing an order not owned by user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 1234,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: '039843huhf',
      orderId: order.id,
    })
    .expect(401)
})

it('should return a 400 when order is cancelled', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
    price: 1234,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: '039843huhf',
      orderId: order.id,
    })
    .expect(400)
})
