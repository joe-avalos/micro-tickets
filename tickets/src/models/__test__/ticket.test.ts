import {Ticket} from '../ticket'


it('should implement OCC', async (done)=>{
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })
  
  // Save ticket to DB
  await ticket.save()
  
  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)
  
  //Make two separate changes to the tickets we fetched
  firstInstance!.set({price: 10})
  secondInstance!.set({price: 15})
  
  // Save the first fetched ticket
  await firstInstance!.save()
  
  try { // Expect error trying to save second fetched ticket
    await secondInstance!.save()
  } catch (e) {
    return done()
  }
  
  throw new Error('Should not reach this point.')
})

it('should increment the version number on multiple saves', async ()=>{
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })
  
  // Save ticket to DB
  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  
  //Make two separate changes to the tickets we fetched
  firstInstance!.set({price: 10})
  await firstInstance!.save()
  expect(firstInstance!.version).toEqual(2)
})
