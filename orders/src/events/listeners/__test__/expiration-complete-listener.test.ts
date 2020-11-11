import {ExpirationCompleteListener} from '../expiration-complete-listener'
import {natsWrapper} from '../../../nats-wrapper'
import {ExpirationCompleteEvent, OrderStatus} from '@boloyde-gittix/common'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../../models/ticket'
import {Order} from '../../../models/order'


const setup = async () => {
  // Create instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client)
  
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 22,
  })
  await ticket.save()
  
  const order = Order.build({
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  })
  await order.save()
  
  // Create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }
  
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return {listener, ticket, order, data, msg}
}

it('should update the order status to cancelled', async ()=>{
  const {listener, order, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  const updatedOrder = await Order.findById(order.id)
  
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should emit an OrderCancelledEvent', async ()=>{
  const {listener, order, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  
  expect(eventData.id).toEqual(order.id)
})

it('should ack the msg', async ()=>{
  const {listener, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  expect(msg.ack).toHaveBeenCalled()
})
