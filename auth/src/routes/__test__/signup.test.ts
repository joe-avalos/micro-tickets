import request from 'supertest'
import {app} from '../../app'

it('should return a 201 on succesful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(201)
})

it('should return 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test',
      password: 'Password',
    })
    .expect(400)
})

it('should return 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test',
      password: 'p',
    })
    .expect(400)
})

it('should return 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400)
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'Password'
    })
    .expect(400)
})

it('should reject duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(201)
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(400)
})

it('should set a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Password',
    })
    .expect(201)
  
  expect(response.get('Set-Cookie')).toBeDefined()
})
