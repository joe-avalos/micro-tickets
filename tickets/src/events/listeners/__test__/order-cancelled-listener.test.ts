import {OrderCancelledListener} from '../order-cancelled-listener'
import {natsWrapper} from '../../../nats-wrapper'
import {Ticket} from '../../../models/ticket'
import mongoose from 'mongoose'
import {OrderCancelledEvent} from '@boloyde-gittix/common'
import {Message} from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  
  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    userId: mongoose.Types.ObjectId().toHexString(),
  })
  ticket.set({orderId})
  await ticket.save()
  
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }
  
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return {listener, orderId, ticket, data, msg}
}

it('should update the ticket, publish the event and ack the message', async () => {
  const {listener, ticket, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  const updatedTicket = await Ticket.findById(ticket.id)
  
  expect(updatedTicket!.orderId).toBeUndefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  
  
})
