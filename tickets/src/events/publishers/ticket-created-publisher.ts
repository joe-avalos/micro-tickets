import {Publisher, Subjects, TicketCreatedEvent} from '@boloyde-gittix/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated
}
