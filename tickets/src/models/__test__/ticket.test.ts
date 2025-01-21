import { Ticket } from "../ticket"

it('implements Optimistic Concurrency Control', async () => {
    // Create an instance of ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
     });

     // Save document
     await ticket.save()

     // Fetch above ticket twice
     const firstInstance = await Ticket.findById(ticket.id);
     const secondInstance = await Ticket.findById(ticket.id);

     // Make two separate changes to the tickets
     firstInstance!.set({price: 10})
     secondInstance!.set({price: 15})

     // Save the first fetched ticket
     await firstInstance!.save();

     // Save the second fetched ticket
     try{
        await secondInstance!.save()
     }catch(err){
        return;
     }

     throw new Error('Should not reach this point')

})

it('increments the version number on multiple saves.', async() => {
   const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123'
   })

   await ticket.save();
   expect(ticket.version).toBe(0)
   
   // Update Ticket
   ticket.set({
      price: 10
   })
   await ticket.save();
   expect(ticket.version).toBe(1)

   await ticket.save();
   expect(ticket.version).toBe(2)
   
})