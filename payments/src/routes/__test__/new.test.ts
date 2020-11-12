import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {Order} from '../../models/order'
import {OrderStatus} from '@boloyde-gittix/common'
import {stripe} from '../../stripe'
import {Payment} from '../../models/payment'

// jest.mock('../../stripe')

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

it('should return a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId,
    price: 2873,
  })
  await order.save()
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)
  
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  
  // expect(chargeOptions.source).toEqual('tok_visa')
  // expect(chargeOptions.amount).toEqual(price * 100)
  // expect(chargeOptions.currency).toEqual('usd')
  const stripeCharges = await stripe.charges.list({limit: 50})
  const stripeCharge = stripeCharges.data.find(charge => charge.metadata.orderId === order.id)
  
  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.amount).toEqual(order.price * 100)
  
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  })
  expect(payment).not.toBeNull()
  expect(payment!.stripeId).toEqual(stripeCharge!.id)
})
