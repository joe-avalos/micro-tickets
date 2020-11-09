import request from 'supertest'
import mongoose from 'mongoose'

import {app} from '../../app'
import {Ticket} from '../../models/ticket'
import {OrderStatus} from '../../models/order'
import {natsWrapper} from '../../nats-wrapper'

const createTicketAndUser = async ()=>{
  // Create ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  })
  await ticket.save()
  const user = global.signup()
  return {ticket, user}
}

it('should mark the order as cancelled', async () => {
  const {ticket, user} = await createTicketAndUser()
  
  // Make request to build an order with ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)
  
  // Make request to fetch the order
  const {body: fetchedOrder} = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  
  expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled)
})

it('should emit a order cancelled event', async ()=>{
  const {ticket, user} = await createTicketAndUser()
  
  // Make request to build an order with ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)
  
  // Make request to fetch the order
  const {body: fetchedOrder} = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
