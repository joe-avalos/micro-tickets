import mongoose from 'mongoose'
import {Order, OrderStatus} from './order'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  
  findByEvent(data: { id: string, version: number }): Promise<TicketDoc | null>
}

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
    min: 0,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
  },
})
TicketSchema.set('versionKey', 'version')
TicketSchema.plugin(updateIfCurrentPlugin) // OCC with external node_module library MUIC

// TicketSchema.pre('save', function (done){ // OCC without external node_module
//   // @ts-ignore
//   this.$where = {
//     version: this.get('version') - 1
//   }
//
//   done()
// })

TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}

TicketSchema.statics.findByEvent = (data: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: data.id,
    version: data.version - 1,
  })
}

TicketSchema.methods.isReserved = async function () {
  // Run query to look at all orders.
  // Find order where ticket is TicketId and status is not cancelled
  // If order is found, ticket is reserved
  const existingOrder = await Order.findOne({
    // this === ticket document that we just called 'isReserved'
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })
  
  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)

export {Ticket}
