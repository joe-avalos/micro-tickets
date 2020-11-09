import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {Ticket} from '../../models/ticket'
import {Order, OrderStatus} from '../../models/order'

it('should return 404 if ticket does not exist', async ()=>{
  const ticketId = mongoose.Types.ObjectId()
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ticketId})
    .expect(404)
})

it('should return 400 if ticket is reserved', async ()=>{
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  })
  await ticket.save()
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
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  })
  await ticket.save()
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ticketId: ticket.id})
    .expect(201)
})

it.todo('should emit order created event')
