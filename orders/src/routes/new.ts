import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import {BadRequestError, NotFoundError, requireAuth, validateRequest} from '@boloyde-gittix/common'
import mongoose from 'mongoose'

import {Ticket} from '../models/ticket'
import {Order, OrderStatus} from '../models/order'
import {natsWrapper} from '../nats-wrapper'
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {ticketId} = req.body
    
    // Find ticket in the DB
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }
    
    // Confirm ticket is not reserved
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }
    
    // Calculate expiration date for order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    
    // Build the order and save to DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })
    
    await order.save()
    
    // Publish event saying order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price
      },
    })
    
    res.status(201).send(order)
  })

export {router as newOrderRouter}
