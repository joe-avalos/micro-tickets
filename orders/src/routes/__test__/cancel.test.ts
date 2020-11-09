import request from 'supertest'
import {app} from '../../app'
import {Ticket} from '../../models/ticket'
import {OrderStatus} from '../../models/order'

it('should mark the order as cancelled', async () => {
  // Create ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  })
  
  await ticket.save()
  const user = global.signup()
  
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

it.todo('should emit a cancelled event')
