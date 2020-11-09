import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {Ticket} from '../../models/ticket'
import {Order, OrderStatus} from '../../models/order'
import {natsWrapper} from '../../nats-wrapper'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  })
  await ticket.save()
  return ticket
}

it('should return 404 if ticket does not exist', async ()=>{
  const ticketId = mongoose.Types.ObjectId()
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ticketId})
    .expect(404)
})

it('should return 400 if ticket is reserved', async ()=>{
  const ticket = await buildTicket()
  const order = Order.build({
    ticket,
    userId:'4oi0384o',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  await order.save()
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ticketId: ticket.id})
    .expect(400)
})

it('should return a 201 and order when everything goes right', async ()=>{
  const ticket = await buildTicket()
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ticketId: ticket.id})
    .expect(201)
})

it('should publish a order created event', async ()=>{
  const ticket = await buildTicket()
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ticketId: ticket.id})
    .expect(201)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
