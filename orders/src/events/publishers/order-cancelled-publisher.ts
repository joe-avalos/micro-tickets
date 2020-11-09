import {OrderCancelledEvent, Publisher, Subjects} from '@boloyde-gittix/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
