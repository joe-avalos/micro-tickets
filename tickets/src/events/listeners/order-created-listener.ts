import {Listener, OrderCreatedEvent, Subjects} from '@boloyde-gittix/common'
import {queueGroupName} from './queue-group-name'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../models/ticket'
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
  
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that is being reserved
    const ticket = await Ticket.findById(data.ticket.id)
    
    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    // Mark ticket as being reserved by setting the orderId property
    ticket.set({orderId: data.id})
    await ticket.save()
    
    // Publish the event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })
    
    // Ack the msg
    msg.ack()
  }
}
