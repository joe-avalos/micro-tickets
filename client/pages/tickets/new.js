import {useState} from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  
  const {doRequest, errors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  })
  const onSubmit = (e) => {
    e.preventDefault()
    setTitle('')
    setPrice('')
    doRequest()
  }
  const onBlur = () => {
    const value = parseFloat(price)
    if (isNaN(value)) {
      return
    }
    setPrice(value.toFixed(2))
  }
  return <div>
    <h1>Create a Ticket</h1>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          type="text"
          name="title"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          value={price}
          onChange={event => setPrice(event.target.value)}
          onBlur={onBlur}
          type="text"
          name="price"
          className="form-control"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </div>
}

export default NewTicket
