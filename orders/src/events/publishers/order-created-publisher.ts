import {OrderCreatedEvent, Publisher, Subjects} from '@boloyde-gittix/common'


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated
}
