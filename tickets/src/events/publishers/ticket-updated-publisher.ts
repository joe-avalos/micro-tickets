import {Publisher, Subjects, TicketUpdatedEvent} from '@boloyde-gittix/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated
}
