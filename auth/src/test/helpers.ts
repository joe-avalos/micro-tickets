import jwt from 'jsonwebtoken'

const signup = (): string[] => {
  // Build a JWT token
  const payload = {
    id: '98349hf998uwe',
    email: 'test@test.com',
  }
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  
  // Build session object {jwt: MY_JWT}
  const session = {jwt: token}
  
  // Turn session into JSON
  const sessionJSON = JSON.stringify(session)
  
  // Encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  
  // return cookie string
  return [`express:sess=${base64}`]
}

export {signup}
