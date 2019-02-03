const Ticket = require('../models/ticket')

module.exports = {
  async POST (req, res, next) {
    // check for secret
    const { secret } = req.query

    if (!secret) 
      return res.sendStatus(401)

    const ticket = await Ticket.findById(req.body.ticketId)  
    
    if (!ticket) 
      return res.sendStatus(404)

    if (ticket.customer_secret != secret) 
      return res.sendStatus(400)

    next()
  }
}