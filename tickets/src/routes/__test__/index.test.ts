import request from 'supertest'
import {app} from '../../app'

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'lorem2sdf',
      price: 3984,
    })
}

it('should return a list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()
  
  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)
  
  expect(response.body.length).toBe(3)
})
