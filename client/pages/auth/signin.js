import {useState} from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

const signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const {doRequest, errors} = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email, password,
    },
    onSuccess: () => Router.push('/')
  })
  
  const onSubmit = async (event) => {
    event.preventDefault()
    
    await doRequest()
  }
  
  return <form onSubmit={onSubmit}>
    <h1>Sign In</h1>
    <div className="form-group">
      <label htmlFor="email">Email Address</label>
      <input type="text" onChange={e => setEmail(e.target.value)} value={email} className="form-control" name="email"/>
    </div>
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input type="password" onChange={e => setPassword(e.target.value)} value={password} className="form-control"
             name="password"/>
    </div>
    {errors}
    <button className="btn btn-primary" type="submit">Sign In</button>
  </form>
}

export default signin