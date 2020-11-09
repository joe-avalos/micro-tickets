import {TicketCreatedListener} from '../ticket-created-listener'
import {natsWrapper} from '../../../nats-wrapper'
import {TicketCreatedEvent} from '@boloyde-gittix/common'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../../models/ticket'

const setup = async ()=>{
  // Create instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)
  
  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 15,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
   return {listener, data, msg}
}

it('should create and save a ticket', async ()=>{
  const {listener, data, msg} = await setup()
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)
  // Write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  // @ts-ignore
  expect(parseFloat(ticket!.price)).toBe(data.price)
})

it('should ack the message', async ()=>{
  const {listener, data, msg} = await setup()
  
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data,msg)
  
  // Assertion of ack function call
  expect(msg.ack).toHaveBeenCalled()
})
