import {ValidationError} from 'express-validator'
import {CustomError} from './CustomError'

export class RequestValidationError extends CustomError{
  statusCode = 400
  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters')
    
    // Only because we're extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }
  serializeErrors(){
    return  this.errors.map(error => {
      return {message: error.msg, field: error.param}
    })
  }
}
