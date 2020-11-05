import request from 'supertest'
import {app} from '../../app'
import {signup} from '../../test/helpers'

it('should clear cookie after signing out', async ()=>{
  const cookie = await signup()
  expect(cookie).toBeDefined()
  const responseOut = await request(app)
    .post('/api/users/signout')
    .set('Cookie',cookie)
    .send()
    .expect(200)
  
  expect(responseOut.get('Set-Cookie')[0]).toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})
