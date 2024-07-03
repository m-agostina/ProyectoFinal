import Ticket from '../models/ticket.model.js'

export const createTicketService = async ({ amount, purchaser }) => {
    try {
        const lastTicket = await Ticket.findOne({}, {}, { sort: { 'code': -1 } })

        let nextCode = 1
        if (lastTicket) {
            nextCode = parseInt(lastTicket.code.split('_')[1]) + 1
        }

        const code = `code_${nextCode}`
        const newTicket = new Ticket({
            code,
            amount,
            purchaser
        })
        await newTicket.save()
        return newTicket
    } catch (err) {
        console.error(err)
        throw new Error(`Error al crear el ticket: ${err.message}`)
    }
}