const express = require('express');
const v4 = require('uuid/v4')
const router = express.Router();

const serializer = require('../serializer');
const Ticket = require('../models/ticket');
const Customer = require('../models/customer');
const FieldBoy = require('../models/fieldBoy');
const config = require('../config')

const sms = require('../services/sms')

const moment = require('moment');
const { middleware } = require('../util/auth')


router.get('/resolve/:id/:secret', async (req, res) => {
  // tro to find such a ticket
  const ticket = await Ticket.findOne({
    where: {
      id: req.params.id,
      secret: req.params.secret,
      status: 0
    }
  }).catch(console.error)

  if (!ticket) {
    return res.send('<h1>Ticket is already resolved OR has been re-assigned OR Incorrect Link')
  }

  ticket.set("status", 2) // mark as resolved
  ticket.set("agent_resolve_time", moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
  await ticket.save()

  res.send('<h1>Great Work!, Ticket has been resolved')
})

router.use(middleware)

router.get('/',(req,res)=>{
   // console.log(req.query , req.params);
    Ticket.findAll({
        where : {
          status : { $ne : 3 }
        },
        include : [{model : FieldBoy , as : 'fb'} ,{model : Customer, as : 'customer'}]
    }).then(result=>{
        result = result.map(ticket => {
          ticket = ticket.get({plain: true})
          if (!ticket.fb) {
            ticket.fb = {}
          }
          return ticket
        })
        res.json(serializer.serialize('ticket',result));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});

router.get('/:id', (req,res)=>{
    Ticket.findOne({
        where : { 'id' : req.params.id },
        include : [{model : Customer,as : 'customer'}, {
          model: FieldBoy,
          as: 'fb'
        }, {
          model: FieldBoy,
          as: 'helper'
        }]
    }).then(result=>{
        result = result.get({plain: true})
        if (!result.fb) {
          result.fb = {}
        }
        res.json(serializer.serialize('ticket',result));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  // console.log(req.body);
  const ticket = serializer.deserialize('ticket', req.body);

  ticket.cid = ticket.customer;
  ticket.customer_secret = v4()
  // ticket.fieldBoyId = ticket.fieldBoyId || 0 ;

  Ticket.create(ticket).then(savedTicket => {
    savedTicket = JSON.parse(JSON.stringify(savedTicket));
    res.json(serializer.serialize('ticket', savedTicket));
  }).catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
});

router.patch('/:id', async (req,res)=>{
  try {
    const ticket = serializer.deserialize('ticket', req.body);

    delete ticket.time;
    delete ticket.uuid;

    ticket.fieldBoyId = ticket.fb
    ticket.helperBoyId = ticket.helper

    const oldTicket = await Ticket.findById(ticket.id)
    ticket.secret = v4()
    // update ticket info
    await Ticket.update(ticket, {
      where: {
        id: ticket.id
      }
    })

    if (!ticket.fb) {
      // no fb is assigned in this request
      return res.sendStatus(204)
    }


    // shoot sms 
    const dbTicket = await Ticket.findById(ticket.id, {
      include: [{
        model: Customer, as: 'customer'
      }, {
        model: FieldBoy, as: 'fb'
      }]
    })

    let sendSmsToCustomer = Promise.resolve()
    let sendSmsToFieldBoy = Promise.resolve()
    let sendFeedbackSms = Promise.resolve()

    if (oldTicket.status == 0) {
      // not already assigned; shoot an sms to customer
      sendSmsToCustomer = sms.sendToCustomer(dbTicket.customer.Mobile, {
        ticket: dbTicket,
        customer: dbTicket.customer
      })
    }

    // shoot an sms to fieldBoy everytime, except the ticket is being closed
    if (dbTicket.fb.mobile && ticket.status < 3) {
      sendSmsToFieldBoy = sms.sendToFieldBoy(dbTicket.fb.mobile, {
        ticket: dbTicket,
        customer: dbTicket.customer,
        link: `http://api.alphanetbroadband.com/tickets/resolve/${dbTicket.id}/${dbTicket.secret}`
      })
    }

    // shoot an sms to customer for feedback
    if (ticket.status == 3) {
      sendFeedbackSms = sms.sendFeedbackSms(dbTicket.customer.Mobile, {
        ticket: dbTicket,
        customer: dbTicket.customer,
        link: `${config.frontend}/feedback/${dbTicket.id}`,
        secret: dbTicket.customer_secret
      })
    }

    await Promise.all([
      sendSmsToFieldBoy,
      sendSmsToCustomer,
      sendFeedbackSms
    ])

    res.sendStatus(204)
  } catch (e) {
    console.error(e)
  }
    
})



module.exports = router;