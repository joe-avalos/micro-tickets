import {Publisher, PaymentCreatedEvent, Subjects} from '@boloyde-gittix/common'


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  readonly subject = Subjects.PaymentCreated
}
