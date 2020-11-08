import request from 'supertest'
import mongoose from 'mongoose'

import {app} from '../../app'
import {natsWrapper} from '../../nats-wrapper'

it('should return 404 if id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'sdfosidfh',
      price: 485,
    })
    .expect(404)
})

it('should return 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdfosidfh',
      price: 485,
    })
    .expect(401)
})

it('should return a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signup())
    .send({
      title: 'sdfosidfh',
      price: 485,
    })
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'asdf6y46h',
      price: 139,
    })
    .expect(401)
})
it('should return 400 if the user provides and invalid title or price', async () => {
  const cookie = global.signup()
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfosidfh',
      price: 485,
    })
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 139,
    })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '34ffqwefsdfs',
      price: -139,
    })
    .expect(400)
})
it('should update the ticket with valid properties', async () => {
  const cookie = global.signup()
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfosidfh',
      price: 485,
    })
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'New Title',
      price: 139,
    })
    .expect(200)
  
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
  
  expect(ticketResponse.body.title).toEqual('New Title')
  expect(ticketResponse.body.price).toEqual(139)
})

it('should publish an update event', async () => {
  const cookie = global.signup()
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfosidfh',
      price: 485,
    })
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'New Title',
      price: 139,
    })
    .expect(200)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
