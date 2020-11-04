import {CustomError} from './CustomError'

export class DatabaseConnectionError extends CustomError {
  reason = 'DB connection error'
  statusCode = 500
  
  constructor() {
    super('DB connection error')
    
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
  
  serializeErrors() {
    return [
      {message: this.reason},
    ]
  }
}
