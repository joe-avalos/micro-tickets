import {natsWrapper} from '../../../nats-wrapper'
import {TicketUpdatedEvent} from '@boloyde-gittix/common'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../../models/ticket'
import {TicketUpdatedListener} from '../ticket-updated-listener'

const setup = async () => {
  // Create instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)
  
  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 342,
  })
  await ticket.save()
  
  // Create fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'New Concert',
    price: 987,
    userId: 'sdhsofhsdf',
  }
  
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  
  return {ticket, listener, data, msg}
}

it('should find, update, and save a ticket', async () => {
  const {ticket, listener, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  const updatedTicket = await Ticket.findById(ticket.id)
  
  expect(updatedTicket!.title).toEqual(data.title)
  // @ts-ignore
  expect(parseFloat(updatedTicket!.price)).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('should ack the message', async () => {
  const {listener, data, msg} = await setup()
  
  await listener.onMessage(data, msg)
  
  expect(msg.ack).toHaveBeenCalled()
})

it('should not call ack if the event skipped a version', async () => {
  const {listener, data, msg} = await setup()
  data.version = 5
  try {
    await listener.onMessage(data, msg)
  } catch (e) {
  }
  
  expect(msg.ack).not.toHaveBeenCalled()
})
