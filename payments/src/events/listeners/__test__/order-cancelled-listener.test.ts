import {OrderCancelledListener} from '../order-cancelled-listener'
import {natsWrapper} from '../../../nats-wrapper'
import {OrderCancelledEvent, OrderStatus} from '@boloyde-gittix/common'
import mongoose from 'mongoose'
import {Order} from '../../../models/order'
import {Message} from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 498,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  })
  
  await order.save()
  
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  }
  
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return {listener, order, data, msg}
}

it('should update the status of the order', async () => {
  const {listener, order, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  const updatedOrder = await Order.findById(order.id)
  
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should ack the msg', async () => {
  const {listener, order, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  expect(msg.ack).toHaveBeenCalled()
})
