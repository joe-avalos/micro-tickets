import {ExpirationCompleteEvent, Publisher, Subjects} from '@boloyde-gittix/common'


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  readonly subject = Subjects.ExpirationComplete
}
