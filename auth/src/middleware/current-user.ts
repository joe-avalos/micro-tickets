import {Response, Request, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  email: string
  id: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next()
  }
  
  try {
    req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
  } catch (e) {}
  next()
}
