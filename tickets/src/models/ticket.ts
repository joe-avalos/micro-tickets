import mongoose from 'mongoose'


// An interface thar describes the properties that are required to create a new Ticket
interface TicketAttrs {
  title: string
  price: number
  userId: string
}

// An interface that describes the properties used by Ticket Document
interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
}

// An interface that describes the properties used by a Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
  },
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export {Ticket}
