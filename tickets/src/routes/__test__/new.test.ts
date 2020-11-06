import request from 'supertest'

import {app} from '../../app'
import {Ticket} from '../../models/ticket'

it('should have a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
  
  expect(response.status).not.toEqual(404)
})

it('should reject users that are not signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('should accept requests from signed in users', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({})
  expect(response.status).not.toEqual(401)
})

it('should return error if and invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: '',
      price: 10,
    })
    .expect(400)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      price: 10,
    })
    .expect(400)
})

it('should return error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'sdafsadfsa',
      price: -10,
    })
    .expect(400)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'sdfkhsdfkj',
    })
    .expect(400)

})

it('should create a ticket with valid parameters', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)
  const title = 'sdfkhsdfkj'
  const price = 15.34
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title,
      price,
    })
    .expect(201)
  
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual(title)
  expect(tickets[0].price).toEqual(price)
})
