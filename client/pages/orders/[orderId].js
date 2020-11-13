import {useEffect, useState} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

const OrderShow = ({order, currentUser}) => {
  const [timeLeft, setTimeLeft] = useState(0)
  
  const {doRequest, errors} = useRequest({
    url:'/api/payments',
    method: 'post',
    body:{
      orderId: order.id,
    },
    onSuccess: payment => Router.push('/orders')
  })
  
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const intervalId = setInterval(findTimeLeft, 1000)
    
    return () => {
      clearInterval(intervalId)
    }
  }, [])
  
  if (timeLeft <= 0) {
    return <div>Order Expired</div>
  }
  
  return <div>
    Time remaining for ticket reservation: {timeLeft} seconds
    <StripeCheckout
      token={({id}) => doRequest({token: id})}
      stripeKey="pk_test_51HmmHlBYybzdFIzgV0uY2dWmRZPChCVjwweW8BTtnHDuDQM0muI7zpZZp39elaob8RadNmKpgs4va098cfagXlyc009G7nkcqD"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>
}

OrderShow.getInitialProps = async (context, client) => {
  const {orderId} = context.query
  const {data} = await client.get(`/api/orders/${orderId}`)
  
  return {order: data}
}

export default OrderShow
