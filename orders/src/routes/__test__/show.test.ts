import request from 'supertest'
import mongoose from "mongoose"

import {app} from '../../app'
import {Ticket} from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  })
  await ticket.save()
  return ticket
}

it('should fetch the order', async () => {
  // Create ticket
  const ticket = await buildTicket()
  
  const user = global.signup()
  
  // Make request to build an order with ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)
  
  // Make request to fetch the order
  const {body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  
  expect(fetchedOrder.id).toEqual(order.id)
})

it('should return 401 when other user tries to fetch the order', async () => {
  // Create ticket
  const ticket = await buildTicket()
  
  // Make request to build an order with ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ticketId: ticket.id})
    .expect(201)
  
  // Make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(401)
})
