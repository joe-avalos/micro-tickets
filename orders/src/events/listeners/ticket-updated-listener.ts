import {Listener, Subjects, TicketUpdatedEvent} from '@boloyde-gittix/common'
import {queueGroupName} from './queue-group-name'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../models/ticket'


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const {title, price} = data // For OCC without external node_module: const {title, price, version} = data
    const ticket = await Ticket.findByEvent(data)
    
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    
    ticket.set({
      title,
      price,
      // version, // OCC without external node_module
    })
    await ticket.save()
    
    msg.ack()
  }
}
