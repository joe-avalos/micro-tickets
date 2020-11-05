import request from 'supertest'
import {app} from '../../app'

it('should return 400 with a email that does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(400)
})

it('should return 400 with an incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(201)
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'dskhsl',
    })
    .expect(400)
})

it('should respond with a cookie when signin correct', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(201)
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(200)
  expect(response.get('Set-Cookie')).toBeDefined()
})
